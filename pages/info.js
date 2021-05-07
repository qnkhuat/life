import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useAuth } from '../lib/firebase/auth';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axios from "axios";
import { storage } from "../lib/firebase/client";
import FirebaseUpload from "../components/FirebaseUpload";

export default function Info() {
  const { auth, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading) router.push(`/login`);
  }, [auth, loading]);

  const [ fullname, setFullname ] = useState(null);
  const [ username, setUsername ] = useState(null);
  //const [ birthday, setBirthday ] = useState(dayjs().format("yyyy-MM-ddThh:mm"));
  const [ birthday, setBirthday ] = useState("2017-05-24T10:30");
  const [ maxAge, setMaxAge ] = useState(100);
  const [ email, setEmail] = useState(auth?.email || null);
  const [ about, setAbout ] = useState(null);
  const [ avatar, setAvatar] = useState(null);

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
    console.log(payload);
    axios.post("/api/user", payload).then(( res ) => {
      router.push(router.query.next != undefined ? router.query.next : '/'); 
    }).catch(( error ) => {
      alert("Recheck your form bitch: ", error);
    })
  }

  function upload(e){
    const file = e.target.files[0];
    const filename = file.name;
    const storageRef = storage.ref().child(`img/${filename}`);
    const task = storageRef.put(file);
    task.on('state_changed', function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      console.log(percentage);
    }, function error(err) {
      console.log("error: ", error);
    },function complete() {
      console.log("completed");
    });
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
          label="birthday" 
          variant="outlined" 
          type="datetime-local"
          InputLabelProps={{shrink: true}}
          required/>
        <TextField id="info-maxage" 
          onChange={(e) => setMaxAge(e.target.value)}
          label="MaxAge" 
          variant="outlined" 
          type="number" 
          defaultValue={100}
          required/>
        <TextField id="info-email" 
          onChange={(e) => setEmail(e.target.value)}
          label="Email" 
          disabled={auth?.email ? true : false}
          variant="outlined"           
          defaultValue={auth?.email || null}
          InputProps={{ readOnly: true}}
        />
        <TextField id="info-about" 
          onChange={(e) => setAbout(e.target.value)}
          label="About your sefl" 
          multiline
          variant="outlined" />

          <FirebaseUpload id="info-avatar" setValueOnComplete={setAvatar}/>
        
        <Button id="info-submit" variant="outlined" color="primary" onClick={submit}>
          Submit
        </Button>
      </form>
    </>
  )
}

