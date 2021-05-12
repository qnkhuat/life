import { useState, useEffect, forwardRef } from "react";
import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/core/Alert';

import { useAuth, withAuth } from '../lib/firebase/auth';
import { formatDate  } from "../lib/util";

import FirebaseUpload from "../components/FirebaseUpload";
import Loading from "../components/Loading";
import Layout from "../components/Layout";

import urljoin from "url-join";
import axios from "axios";

import * as config from "../config";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function Settings() {
  const { auth, refreshUser, loading } = useAuth();

  const [ userNameValidation, setUsernameValidation ] = useState({valid:false, msg: ""});
  const [ data, setData] = useState({ 
    updated: false,
    userInfo: {
      id: null,
      user: {
        fullname: auth.displayName,
        maxAge: 100,
        username: null,
        birthday: null,
        email:auth.email,
        about:null,
        avatar:null
      }
    }
  });

  const [ alertOpen, setAlertOpen] = useState(false);
  const [ alert, setAlert ] = useState({
    severity: "success",
    message: "",
  });

  function handleCloseAlert() {
    setAlertOpen(false);
  }


  const [ currentUsername, setCurrentUsername] = useState(null);
  const [ usernames, setUsernames ] = useState([]);
  const [ displayAvatar, setDisplayAvatar] = useState(null);

  const router = useRouter();

  function setUserInfoByField(field, value){
    data.userInfo.user[field] = value;
    setData(data);
  }


  function handleUploadComplete(path, url) {
    // when user upload avatar
    data.userInfo.user.avatar = path;
    setData(data);
    setDisplayAvatar(url);
  }

  useEffect(() => {
    if (!data.updated){
      refreshUser().then((user) => {
        if (!user) return;
        setData({updated:true, userInfo: user});
        setCurrentUsername(user.user.username);
        validateUserName(user.user.username);
        setDisplayAvatar(user.user.avatar);
      }).catch((error) => {
        setData({updated:true, userInfo: data.userInfo});
      });
      axios.get(urljoin(process.env.API_URL, "/api/usernames")).
        then((res) => setUsernames(res.data)).
        catch((error) => console.error("Error fetch username lists: ", error?.response.data.error));
    }
  }, [])

  if (!data.updated || loading) return <Loading />;

  function validateUserName(value){
    if (!value || !(value.length >= 6 && value.length <= 20) ){
      setUsernameValidation({valid: false, msg: "Min 8 characters, max 20 characters"});
    }
    else if (config.usernameRegex.test(value)) {
      if (usernames.includes(value) && value != currentUsername){
        setUsernameValidation({valid:false, msg: "Username existed"});
      } else {
        setUsernameValidation({valid:true, 
          msg: "Your profile link: " + urljoin(process.env.BASE_URL, value ? value : "/").
          replace("http://", "").
          replace("https://", "")});
      }
    } else setUsernameValidation({valid: false, msg: "Username must contain only letters, numbers, period(.), and underscore(_)"});
  }

  function handleOnChangeUsername(value) {
    validateUserName(value);
    setUserInfoByField("username", value);
  }

  async function submit(){
    
    if (data?.userInfo.id) { // Update
      let payload = data.userInfo.user;
      await axios.patch(urljoin(process.env.API_URL,`/api/user/${data.userInfo.id}`), payload).then(( res ) => {
        if (res.status == 200) {
          refreshUser();
          setAlert({severity: "success", message: "Saved sucessfully" });
          setAlertOpen(true);
        }
      }).catch(( error ) => {
        console.error("Failed to update user: ", error?.response.data.error);
      })
    } else { // Add user
      const payload = {
        id: auth.uid,
        user: data.userInfo.user,
      }
      await axios.post(urljoin(process.env.API_URL, "/api/user"), payload).then(( res ) => {
        if (res.status == 200) {
          refreshUser().then((res) => {
            router.push("/[username]", `/${res.user.username}`);
          }).catch((error) => {
            router.push(`/404`);
          })
        }
      }).catch(( error ) => {
        console.log("Recheck your form bitch: ", error?.response.data.error);
      })
    }
  }

  return (
    <Layout>
      <p className="text-center text-xl font-bold my-8">Account settings</p>
      <form key={data.updated} className="" noValidate autoComplete="off" className="flex flex-col items-center m-auto w-4/5">
        <div className="relative">
          <Avatar
            className="w-32 h-32 text-4xl border rounded-full shadow mb-4"
            alt={data?.userInfo.user.avatar}
            src={displayAvatar || "/fake-image.jpg"}
          >
          </Avatar>

          <FirebaseUpload id="profile-avatar" onComplete={ handleUploadComplete } prefix={data?.userInfo.user.username ? data?.userInfo.user.username : "avatar"}  className="bg-black w-full">
            <IconButton component="span"
              className="outline-none absolute right-2 bottom-2 bg-blue-400 bg-opacity-40 p-2"
              aria-label="Search">
              <PhotoCameraIcon fontSize="small"></PhotoCameraIcon>
            </IconButton>
          </FirebaseUpload>

        </div>

        <TextField id="profile-username" 
          className="w-full mt-6"
          error={!userNameValidation['valid']}
          defaultValue={data?.userInfo.user.username}
          onChange={(e) => handleOnChangeUsername(e.target.value)}
          label="Username" 
          variant="outlined" 
          required
          helperText={userNameValidation['msg']}
        />

        <TextField id="profile-fullname" 
          className="w-full mt-6"
          onChange={(e) => setUserInfoByField("fullname", e.target.value)}
          label="Full name" 
          variant="outlined" 
          defaultValue={data?.userInfo.user.fullname}
          required/>

        <TextField id="profile-birthday" 
          className="w-full mt-6"
          onChange={(e) => setUserInfoByField("birthday", new Date(e.target.value))}
          defaultValue={data?.userInfo ? formatDate(data?.userInfo.user.birthday, "YYYY-MM-DD") : ""}
          label="Birthday" 
          variant="outlined" 
          type="date"
          InputLabelProps={{shrink: true}}
          required/>

        <TextField id="profile-maxage" 
          className="w-full mt-6"
          onChange={(e) => setUserInfoByField("maxAge", e.target.value)}
          defaultValue={data?.userInfo.user.maxAge}
          label="Life expectency" 
          variant="outlined" 
          type="number" 
        />

        <TextField id="profile-email" 
          className="w-full mt-6"
          label="Email" 
          disabled
          variant="outlined"           
          defaultValue={data?.userInfo.user.email}
          InputProps={{readOnly: true}}
          required
        />

        <TextField id="profile-about" 
          className="w-full mt-6"
          onChange={(e) => setUserInfoByField("about", e.target.value)}
          defaultValue={data?.userInfo.user.about}
          multiline
          rows={3}
          label="About yourself" 
          variant="outlined" 
        />
        <Button id="profile-submit" className="my-6 text-black border-black" variant="outlined" onClick={submit}>
          Save 
        </Button>
      </form>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Layout>
  )
}

export default withAuth(Settings, false, "/login");
