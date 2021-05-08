import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useAuth, withAuth } from '../lib/firebase/auth';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axios from "axios";
import { storage } from "../lib/firebase/client";
import FirebaseUpload from "../components/FirebaseUpload";

function Info() {
  const { auth, user, refreshUser, loading } = useAuth();
  const router = useRouter();

  const [ fullname, setFullname ] = useState(null);
  const [ username, setUsername ] = useState(null);
  const [ birthday, setBirthday ] = useState("2017-05-24T10:30");
  const [ maxAge, setMaxAge ] = useState(100);
  const [ email, setEmail] = useState(auth?.email || null);
  const [ about, setAbout ] = useState(null);
  const [ avatar, setAvatar] = useState(null);

  useEffect(() => {
    setEmail(auth?.email);
    if (user) {
      router.push(`/${user.username}/edit`);
    }
  }, [auth, user]);

  function submit(){
    const payload = {
      username: username,
      user: {
        fullname: fullname,
        birthday: birthday,
        maxAge: maxAge,
        email: email,
        about: about,
        avatar: avatar
      }
    }
    axios.post("/api/user", payload).then(( res ) => {
      if (res.status == 200) {
        refreshUser(auth).then((res) => {
        router.push(`/${username}/edit`);
        }).catch((error) => {
          router.push(`/404`);
        })
      }
    }).catch(( error ) => {
      console.log("Recheck your form bitch: ", error);
    })
  }

  return (
    <>
      <form className="" noValidate autoComplete="off" className="flex mt-40">
        <TextField id="info-fullname" 
          label="Full name" 
          variant="outlined" 
          onChange={(e) => setFullname(e.target.value)}
          required/>
        <TextField id="info-username" 
          onChange={(e) => setUsername(e.target.value)}
          label="Username" 
          variant="outlined" 
          required/>
        <TextField id="info-birthday" 
          onChange={(e) => setBirthday(e.target.value)}
          label="Birthday" 
          variant="outlined" 
          type="datetime-local"
          InputLabelProps={{shrink: true}}
          required/>
        <TextField id="info-maxage" 
          onChange={(e) => setMaxAge(e.target.value)}
          label="MaxAge" 
          variant="outlined" 
          type="number" 
          value={maxAge}
          required/>
        <TextField id="info-email" 
          onChange={(e) => setEmail(e.target.value)}
          label="Email" 
          disabled={auth?.email ? true : false}
          variant="outlined"           
          value={auth?.email || null}
          InputProps={{ readOnly: true}}
        />
        <TextField id="info-about" 
          onChange={(e) => setAbout(e.target.value)}
          label="About your sefl" 
          multiline
          variant="outlined" />

          <FirebaseUpload id="info-avatar" setValueOnComplete={setAvatar} className="bg-black"/>
        
        <Button id="info-submit" variant="outlined" color="primary" onClick={submit}>
          Submit
        </Button>
      </form>
    </>
  )
}

export default withAuth(Info, false, "/loginnnn");
