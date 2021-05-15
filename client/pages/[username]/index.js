import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import Board from '../../components/Board';
import Loading from '../../components/Loading';
import Layout from '../../components/Layout';
import Upsert from '../../components/Story/Upsert';

import { useAuth } from "../../lib/firebase/auth";
import { formatAge, formatMultilineText, roundDate } from '../../lib/util';

import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import Avatar from '@material-ui/core/Avatar';
import Modal from '@material-ui/core/Modal';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';

import axios from "axios";
import urljoin from "url-join";
import dayjs from "dayjs";

const getData = async (username) => {
  const user_res = await axios.get(urljoin(process.env.API_URL, `/api/user?username=${username}`));
  const user = user_res.data;
  const events_res = await axios.get(urljoin(process.env.API_URL, `/api/user/${user.id}/stories`));
  var events = events_res.data;
  const today = roundDate(dayjs());
  const birthday = roundDate(dayjs(user.user.birthday));
  events[uuidv4()] = {
    publish:true,
    date: today.toJSON(),
    type: "today",
    title: "Today",
    imageUrls: [],
    videoUrls: [],
  };

  const result  = {
    events:events,
    user: user,
  }
  return result;
}

// Note on how this page renders
// It uses ISR (Incremental static rendering)
// means every time the request comes, it'll return the cached
// HTML of this page, it will not process to render a new one
// In constrast it'll refresh the cache after (revalidate) seconds defined in getStaticProps return
// But inside the Profile after user access, It'll fetch data to make sure the page is up-to-date
//
// This is the best of both world: static make the site load fast. The second fetch make the site up-to-date
function Profile({ data }) {
  const router = useRouter();
  const { auth, user: currentUser, loading } = useAuth();

  if (router.isFallback) return <Loading />

  const [ state, setState ] = useState({updated: false, updateKey:0, stateData: data });
  const { updated, updateKey, stateData } = state;
  const { events , user } = stateData;

  // Add/Edit Story button controller
  const [openUpsert, setOpenUpsert] = useState(false);
  const [upsertStory, setUpsertStory ] = useState({storyId: null, story: null});


  useEffect(() => {
    if (router.query.username && !updated) {
      getData(router.query.username).then((data) => {
        setState({updated: true, stateData:data, updateKey: uuidv4()})
      }).catch((error) => {
        console.error("Failed to fetch new data", error);
        setState({updated: true, stateData:stateData, updateKey: uuidv4()})
      });
    } 
  }, []);
  if (router.isFallback || loading) return <Loading />;
  const editable = auth && router.query.username == currentUser?.user.username;

  function handleOpenUpsert() {
    setOpenUpsert(true)
    setUpsertStory({storyId:null, story:null});
  };

  function handleCloseUpsert() {
    setOpenUpsert(false)
  };

  function handleCompleteUpsert(storyid, story){
    state.stateData.events[storyid] = story;
    state.updateKey = uuidv4();
    setState(state);
    handleCloseUpsert();
  }

  function onEditEvent (id) {
    setOpenUpsert(true)
    setUpsertStory({storyId:id, story:events[id]});
  }


  return (
    <Layout>
      <div className="my-2">
        <div id="info" className="flex flex-col relative">
          <div className="flex">
            <Avatar
              className="w-28 h-28 text-4xl torder rounded-full shadow mr-4"
              alt={user.user.fullname}
              src={user.user.avatar || "/fake-image.jpg"}>
            </Avatar>
            <div id="info-text" className='flex flex-col justify-center'>
              <p className="font-bold text-lg">{user.user.fullname}</p>
              <p className="text-sm">{formatAge(user.user.birthday)}</p>
            </div>
          </div>
          {user.user.about && <div id="about" className="w-full mt-4"><p>{formatMultilineText(user.user.about)}</p></div>}
          {editable && 
            <Link
              href={`/${user ? "settings" : "login"}`}
              passHref>
              <IconButton
                className="hidden md:block text-gray-700 outline-none rounded p-2 w-14 absolute top-0 right-0"
                aria-label="Settings">
                <SettingsIcon></SettingsIcon>
              </IconButton>
            </Link>
          }
        </div>

        <hr className="my-4"></hr>

        {editable && 

        <div id="add-button" className="fixed bottom-14 right-4 z-10">
          <IconButton
            onClick={handleOpenUpsert}
            className="bg-red-400 text-white p-2 outline-none"
            aria-label="edit" color="primary">
            <AddIcon></AddIcon>
          </IconButton>
          <Modal
            BackdropComponent={Backdrop}
            open={openUpsert}
            onClose={handleCloseUpsert}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 h-full overflow-y-scroll bg-white">
              <IconButton
                id="close-button-add"
                onClick={handleCloseUpsert}
                className="bg-black bg-opacity-50 text-white p-1 outline-none absolute top-2 right-2 z-10"
                aria-label="edit" color="primary">
                <CloseIcon fontSize="small"></CloseIcon>
              </IconButton>
              <Upsert storyId={upsertStory.storyId} story={upsertStory.story} onComplete={handleCompleteUpsert}/>
            </div>
          </Modal>
        </div>
        }
        <Board key={updateKey} events={events} birthday={user.user.birthday} maxAge={user.user.maxAge} onEditEvent={onEditEvent} editable={editable}/>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const user_res = await axios.get(urljoin(process.env.API_URL, `/api/usernames`));

  // Get the paths we want to pre-render based on posts
  const paths = user_res.data.map((username) => ({
    params: { username: username },
  }));

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

export default Profile;
