import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import { useAuth, withAuth } from '../../lib/firebase/auth';
import urljoin from "url-join";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';

import FirebaseUpload from "../../components/FirebaseUpload";
import StoriesList from "../../components/Story/StoriesList";
import Upsert from '../../components/Story/Upsert';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';

import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import { v4 as uuidv4 } from 'uuid';
import { parseCookies, setCookie, destroyCookie } from 'nookies'


const getData = async (username) => {
  const user_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user?username=${username}`));
  const user = user_res.data;
  const events_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${user.id}/stories`));
  const events = events_res.data;
  return {
    events:events,
    user: user,
  }
}

function Edit({ data }) {
  const router = useRouter();
  if (router.isFallback) {
    return <Loading />
  }
  const stateKey = uuidv4();
  const [ state, setState ] = useState({updated: false, stateData: data });
  const { updated, stateData } = state;
  const { events , user } = stateData;
  const [ stories, setStories] = useState(events);
  const [ fullname, setFullname ] = useState(user.user.fullname);
  const [ username, setUsername ] = useState(user.user.username);
  const [ birthday, setBirthday ] = useState(user.user.birthday);
  const [ maxAge, setMaxAge ] = useState(user.user.maxAge);
  const [ about, setAbout ] = useState(user.user.about);
  const [ avatar, setAvatar] = useState(user.user.avatar);

  const setUser = (user) => {
    setFullname(user.fullname);
    setUsername(user.username);
    setBirthday(user.birthday);
    setMaxAge(user.maxAge);
    setAbout(user.about);
    setAvatar(user.avatar);
  }

  if (!user) return router.push("/login?next=/edit");

  useEffect(() => {
    if (router.query.username && !updated) {
      getData(router.query.username).then((data) => {
        setUser(data.user.user);
        setState({updated: true, stateData:data});
      }).catch((error) => {
        console.error("failed to fetch new data", error);
      });
    }
  })

  // Add Story button controller
  const [openAdd, setOpenAdd] = useState(false);
  function handleOpenAdd() {setOpenAdd(true)};
  function handleCloseAdd() {setOpenAdd(false)};

  const { refreshUser } = useAuth();

  function updateProfile(){
    let payload = {
      ...(fullname != user.fullname) && {fullname: fullname},
      ...(birthday != user.birthday) && {birthday: birthday},
      ...(maxAge != user.maxAge) && {maxAge: maxAge},
      ...(about != user.about ) && {about: about},
      ...(avatar!= user.avatar) && {avatar: avatar},
    }
    if (Object.keys(user).length > 0){
      axios.patch(urljoin(process.env.BASE_URL,`/api/user/${user.id}`), payload).then(( res ) => {
        if (res.status == 200) alert("success");
        refreshUser();
      }).catch(( error ) => {
        console.error("Some thing is wrong: ", error);
      })
    }
  }

  function handleStoryAdded(storyId, story){
    stories[storyId] = story
    setStories(stories);
    handleCloseAdd();
  }

  return (
    <Layout>
      <div className="container mx-auto">
        <form id="form-profile" noValidate autoComplete="off" className="flex flex-col mt-40" key={stateKey}>
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
            defaultValue={username}
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
            defaultValue={user.user.email}
            InputProps={{ readOnly: true}}
          />

          <TextField id="profile-about" 
            onChange={(e) => setAbout(e.target.value)}
            defaultValue={about}
            label="About your self" 
            multiline
            variant="outlined" />

          <img src={avatar} alt={username}/>
          <FirebaseUpload id="profile-avatar" prefix={username} className="bg-black" onComplete={(path, url) => setAvatar(url)}/>

          <Button id="profile-submit" variant="outlined" color="primary" onClick={updateProfile}>
            Submit
          </Button>
        </form>
        <div className="add-button">
          <IconButton 
            onClick={handleOpenAdd} 
            aria-label="edit" color="primary">
            <AddIcon fontSize="small"></AddIcon>
          </IconButton>

          <Modal
            BackdropComponent={Backdrop}
            open={openAdd}
            onClose={handleCloseAdd}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-auto" >
              <Upsert onComplete={handleStoryAdded}/>
            </div>
          </Modal>
          <StoriesList key={updated} stories={stories} />
        </div>

      </div>
    </Layout>
  )
}
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const user_res = await axios.get(urljoin(process.env.BASE_URL, `/api/usernames`));

  // Get the paths we want to pre-render based on posts
  const paths = user_res.data.map((username) => ({
    params: { username: username},
  })) 

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true };
}


export async function getStaticProps({ params }) {
  const username = params.username;
  var data = {};
  try {
    data = await getData(username);
  } catch (error){
    return {
      notFound: true,
    }
  }
  return { 
    props: {data:data},
    revalidate: 60,
  };
}

export default withAuth(Edit);
