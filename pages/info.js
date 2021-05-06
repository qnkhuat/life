import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import axios from "axios";

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
  const [ avatar, setAvatar] = useState("");

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
      router.push(router.query.next != undefined ? router.query.next : '/'); 
    }).catch(( error ) => {
      alert("Recheck your form bitch");
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

        <div id="info-avatar">
            <input
              accept="image/*"
              id="upload-button-file"
              multiple
              type="file"
              className="hidden"
              onChange={(e) => setAvatar(e.target.value)}
            />
            <label htmlFor="upload-button-file">
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
        </div>
        <Button id="info-submit" variant="outlined" color="primary" onClick={submit}>
          Submit
        </Button>
      </form>
    </>
  )
}

//name
//avatar
//email
//username
//birthday
//maxAge
