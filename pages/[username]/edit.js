import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/board';
import { useAuth, withAuth } from '../../lib/firebase/auth';
import urljoin from "url-join";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FirebaseUpload from "../../components/FirebaseUpload";
import StoriesList from "../../components/Story/StoriesList";

function Edit({ stories, user }) {
  const { auth, refreshUser } = useAuth();
  const router = useRouter();
  var storiesList = [];
  Object.keys(stories).forEach((key) => {
    storiesList.push(stories[key]);
  });

  const [ fullname, setFullname ] = useState(user.fullname);
  const [ birthday, setBirthday ] = useState(user.birthday);
  const [ maxAge, setMaxAge ] = useState(user.maxAge);
  const [ about, setAbout ] = useState(user.about);
  const [ avatar, setAvatar] = useState(user.avatar);

  function updateProfile(){
    let payload = {
      ...(fullname != user.fullname) && {fullname: fullname},
      ...(birthday != user.birthday) && {birthday: birthday},
      ...(maxAge != user.maxAge) && {maxAge: maxAge},
      ...(about != user.about ) && {about: about},
      ...(avatar!= user.avatar) && {avatar: avatar},
    }
    if (Object.keys(user).length > 0){
      axios.patch(`/api/user/${user.username}`, payload).then(( res ) => {
        if (res.status == 200) alert("success");
        refreshUser();
      }).catch(( error ) => {
        console.error("Some thing is wrong: ", error);
      })
    }
  }

  return (
    <div className="container mx-auto">
      <form id="form-profile" noValidate autoComplete="off" className="flex flex-col mt-40">
        <h3>Update your profile bitch</h3>
        <TextField id="profile-fullname" 
          label="Full name" 
          variant="outlined" 
          onChange={(e) => setFullname(e.target.value)}
          defaultValue={fullname}
          required
        />

        <TextField id="profile-username" 
          label="Username" 
          disabled
          defaultValue={user.username}
          variant="outlined" 
          required/>

        <TextField id="profile-birthday" 
          onChange={(e) => setBirthday(e.target.value)}
          label="Birthday" 
          variant="outlined" 
          type="date"
          defaultValue={birthday}
          InputLabelProps={{shrink: true}}
          required/>

        <TextField id="profile-maxage" 
          onChange={(e) => setMaxAge(e.target.value)}
          label="MaxAge" 
          variant="outlined" 
          defaultValue={maxAge}
          type="number" 
          defaultValue={100}
          required/>

        <TextField id="profile-email" 
          label="Email" 
          disabled
          variant="outlined"           
          defaultValue={user.email}
          InputProps={{ readOnly: true}}
        />

        <TextField id="profile-about" 
          onChange={(e) => setAbout(e.target.value)}
          defaultValue={about}
          label="About your self" 
          multiline
          variant="outlined" />

        <FirebaseUpload id="profile-avatar" prefix={user.username} className="bg-black" setValueOnComplete={setAvatar}/>

        <Button id="profile-submit" variant="outlined" color="primary" onClick={updateProfile}>
          Submit
        </Button>
        <StoriesList stories={stories} />
      </form>

    </div>
  )
}

export async function getServerSideProps(context) {
  const { username } = context.query;
  var stories = null, user = null;
  try {
    const stories_req = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${username}/stories`));
    const user_req = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${username}`));
    stories = stories_req.data;
    user = user_req.data;
  } catch (error){
    return {
      redirect: {
        notFound: true,
      }
    }
  }
  return { props: { stories: stories, user:user } };
}

export default withAuth(Edit, true, "/403");
