import { useState, useEffect, forwardRef } from "react";
import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/core/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useAuth, withAuth } from '../lib/firebase/auth';
import { formatDate, deepClone } from "../lib/util";

import FirebaseUpload from "../components/FirebaseUpload";
import Loading from "../components/Loading";
import Layout from "../components/Layout";
import CustomTextField from "../components/TextField";

import urljoin from "url-join";
import axios from "axios";

import * as config from "../config";

function Settings() {
  const { auth, refreshUser, loading, signOut } = useAuth();
  const router = useRouter();
  if(!auth) {
    router.push("/login?next=/settings");
    return <></>;
  }

  const [ userNameValidation, setUsernameValidation ] = useState({valid:false, msg: ""});
  const [ data, setData] = useState({ 
    updated: false,
    currentUser: {
      id: null, 
      user: {
        fullname: auth.displayName,
        maxAge: 100,
        username: null,
        birthday: null,
        email:auth.email,
        about:null,
        avatar:null,
        private: false,
        twitter: null,
        github: null,
        displayEmail: null,
        website: null,
      },
    },
    userInfo: {
      id: null, 
      user: {
        fullname: auth.displayName,
        maxAge: 100,
        username: null,
        birthday: null,
        email:auth.email,
        about:null,
        avatar:null,
        private: false,
        twitter: null,
        github: null,
        displayEmail: null,
        website: null,
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

  const [ uploadingAvatar, setUploadingAvatar ] = useState(false);
  const [ currentUsername, setCurrentUsername] = useState(null);
  const [ usernames, setUsernames ] = useState([]);
  const [ displayAvatar, setDisplayAvatar] = useState(null);

  function handleSignOut() {
    signOut();
    router.push("/login");
  }

  function setUserInfoByField(field, value){
    if (typeof value == "string") value = value.trim();
    data.userInfo.user[field] = value;
    setData(data);
  }

  function handleUploadComplete(path, url) {
    // when user upload avatar
    setUserInfoByField("avatar", path)
    setDisplayAvatar(url);
    setUploadingAvatar(false);
  }

  useEffect(() => {
    if (!data.updated){
      refreshUser(auth).then((user) => {
        if (!user) throw new Error("User not found");
        setData({updated:true, userInfo: user, currentUser: deepClone(user)});
        setCurrentUsername(user.user.username);
        validateUserName(user.user.username);
        setDisplayAvatar(user.user.avatar);
      }).catch((error) => {
        console.log("User not found", error);
        setData({updated:true, userInfo: data.userInfo, currentUser: data.currentUser});
      });
      axios.get(urljoin(process.env.API_URL, "/api/usernames?private=true")).
        then((res) => {
          const listUsernames = res.data;
          listUsernames.push(...config.usernameBlacklist);
          setUsernames(listUsernames)
        }).
        catch((error) => console.error("Error fetch username lists: ", error));
    }
  }, [])

  if (!data.updated || loading) return <Loading />;

  function validateUserName(value){
    if (!value || !(value.length >= 6 && value.length <= 20) ){
      setUsernameValidation({valid: false, msg: "Min 6 characters, max 20 characters"});
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
    } else setUsernameValidation({valid: false, msg: "Username must contain only lower case letters, numbers, period(.), and underscore(_)."});
  }

  function handleOnChangeUsername(value) {
    validateUserName(value);
    setUserInfoByField("username", value);
  }

  function submit(){
    if(!userNameValidation.valid) {
      setAlert({severity: "error", message: "Please edit your username" });
      setAlertOpen(true);
      return;
    }
    if (data?.userInfo.id) { // Update
      let payload = data.userInfo.user;
      // Since we don't receive the original value of avatar in database ,we only received a genrerated url
      // so we need to manually check it before update
      if (data.userInfo.user.avatar == data.currentUser.user.avatar)  delete payload.avatar;

      axios.patch(urljoin(process.env.API_URL,`/api/user/${data.userInfo.id}`), payload).then(( res ) => {
        if (res.status == 200) {
          refreshUser(auth).then((res) => {
            setAlert({severity: "success", message: "Saved sucessfully" });
            setAlertOpen(true);
          }).catch((error) => {
            setAlert({severity: "error", message: "Failed to update user info" });
            setAlertOpen(true);
          });
        }
      }).catch(( error ) => {
        console.error("Failed to update user: ", error.response.data);
        setAlert({severity: "error", message: "Please fill in all the required fields" });
        setAlertOpen(true);
      });

    } else { // Add user
      const payload = {
        id: auth.uid,
        user: data.userInfo.user,
      }

      axios.post(urljoin(process.env.API_URL, "/api/user"), payload).then(( res ) => {
        if (res.status == 200) {
          // Add the first story as their birthday
          const firstStory = {
            date: payload.user.birthday,
            title: `${payload.user.fullname} were born`,
            type: 'birthday',
            content: null,
            imageUrls: [],
            publish: true
          }
          axios.post(urljoin(process.env.API_URL, `/api/user/${payload.id}/story`), firstStory).catch(( error ) => {
            console.error("Error adding story: ", error);
          });

          refreshUser(auth).then((res) => {
            router.push("/[username]", `/${res.user.username}`);
          }).catch((error) => {
            router.push(`/404`);
          })
        }
      }).catch(( error ) => {
        setAlert({severity: "error", message: "Please edit your info"});
        setAlertOpen(true);
        console.log("Failed to add user: ", error?.response);
      });
    }
  }
  return (
    <Layout>
      <p className="text-center text-xl font-bold my-4">Account settings</p>
      <form key={data.updated} className="" noValidate autoComplete="off" className="flex flex-col items-center m-auto">
        <div className="relative">
          <Avatar
            className="w-32 h-32 text-4xl border rounded-full shadow mb-4"
            alt={data?.userInfo.user.fullname}
            src={displayAvatar || "/fake-image.jpg"}
          >
          </Avatar>

          <FirebaseUpload id="profile-avatar" 
            avatar={true}
            onStart={() => setUploadingAvatar(true)}
            onError={(error) => {
              setUploadingAvatar(false);
              setAlert({severity: "error", message: "Failed to upload avatar, Please try again!" });
              setAlertOpen(true);
            }}
            onComplete={ handleUploadComplete } 
            prefix={data?.userInfo.user.username ? data?.userInfo.user.username : "avatar"}  
            className="bg-black w-full">
            <>
              <IconButton component="span"
                className="outline-none absolute right-2 bottom-2 bg-black bg-opacity-40 p-2 text-white"
                aria-label="Search">
                <PhotoCameraIcon fontSize="small"></PhotoCameraIcon>
              </IconButton>
              {uploadingAvatar && <CircularProgress className="absolute" 
                style={{right: "0.4rem", bottom:"0.4rem"}} size={40} />}
            </>
          </FirebaseUpload>

        </div>

        <CustomTextField id="profile-username" 
          autoCapitalize="none"
          className="w-full mt-6"
          error={!userNameValidation['valid']}
          defaultValue={data?.userInfo.user.username}
          onChange={(e) => handleOnChangeUsername(e.target.value.toLowerCase())}
          label="Username" 
          variant="outlined" 
          required
          helperText={userNameValidation['msg']}
        />

        <CustomTextField id="profile-fullname" 
          className="w-full mt-6"
          onChange={(e) => setUserInfoByField("fullname", e.target.value)}
          label="Full name" 
          variant="outlined" 
          defaultValue={data?.userInfo.user.fullname}
          required/>


        <CustomTextField id="profile-birthday" 
          className="w-full mt-6"
          onChange={(e) => setUserInfoByField("birthday", new Date(e.target.value))}
          defaultValue={data?.userInfo ? formatDate(data?.userInfo.user.birthday, "YYYY-MM-DD") : ""}
          label="Birthday" 
          variant="outlined" 
          type="date"
          InputLabelProps={{shrink: true}}
          required/>

        <CustomTextField id="profile-email" 
          className="w-full mt-6"
          label="Email" 
          disabled
          variant="outlined"           
          defaultValue={data?.userInfo.user.email}
          InputProps={{readOnly: true}}
          required
        />


        <CustomTextField id="profile-maxage" 
          className="w-full mt-6 hidden"
          onChange={(e) => setUserInfoByField("maxAge", e.target.value)}
          defaultValue={data?.userInfo.user.maxAge}
          label="Life expectency" 
          variant="outlined" 
          type="number" 
        />

        <CustomTextField id="profile-about" 
          className="w-full mt-6"
          onChange={(e) => setUserInfoByField("about", e.target.value)}
          defaultValue={data?.userInfo.user.about}
          multiline
          minRows={3}
          label="About yourself" 
          variant="outlined" 
        />

        {data?.userInfo.id && 
        <>
          <p className="text-lg font-bold mt-4">Social accounts</p>
          <CustomTextField id="profile-website" 
            className="w-full mt-6"
            onChange={(e) => setUserInfoByField("website", e.target.value)}
            defaultValue={data?.userInfo.user.website}
            label="Website (full url)" 
            variant="outlined" 
          />

          <CustomTextField id="profile-twitter" 
            className="w-full mt-2"
            onChange={(e) => setUserInfoByField("twitter", e.target.value)}
            defaultValue={data?.userInfo.user.twitter}
            label="Twitter (username)" 
            variant="outlined" 
          />

          <CustomTextField id="profile-github" 
            className="w-full mt-6"
            onChange={(e) => setUserInfoByField("github", e.target.value)}
            defaultValue={data?.userInfo.user.github}
            label="Github (username)" 
            variant="outlined" 
          />

          <CustomTextField id="profile-email" 
            className="w-full mt-6"
            onChange={(e) => setUserInfoByField("displayEmail", e.target.value)}
            defaultValue={data?.userInfo.user.displayEmail}
            label="Display Email" 
            variant="outlined" 
          />
        </>
        }


        <FormControlLabel
          className='w-full'
          control={
            <Checkbox
              id="profile-private"
              color="secondary" 
              defaultChecked={data?.userInfo.user.private}
              onChange={(e) => setUserInfoByField("private", e.target.checked)}
            />
          }
          label="Private Account"
        />
        <p className="text-left text-xs text-gray-500 w-full pl-4">Your account will not be displayed in our search engine and only you can view your page. (It will take several minutes for the change to be applied)</p>

        <Button id="profile-submit" 
          className="mt-6 text-black border-black" 
          disabled={uploadingAvatar}
          variant="outlined" 
          onClick={submit}>
          Save 
        </Button>
        <Button id="profile-logout" 
          className="my-6 text-red-400 border-red-400" 
          disabled={uploadingAvatar}
          variant="outlined" 
          onClick={handleSignOut}>
          Sign Out
        </Button>

      </form>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseAlert}  severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </MuiAlert>
      </Snackbar>
    </Layout>
  )
}

export default withAuth(Settings, false, "/login");
