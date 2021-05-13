import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

import Board from '../../components/Board';
import Loading from '../../components/Loading';
import Layout from '../../components/Layout';

import Avatar from '@material-ui/core/Avatar';

import axios from "axios";
import urljoin from "url-join";

const getData = async (username) => {
  const user_res = await axios.get(urljoin(process.env.API_URL, `/api/user?username=${username}`));
  const user = user_res.data;
  const events_res = await axios.get(urljoin(process.env.API_URL, `/api/user/${user.id}/stories`));
  const events = events_res.data;
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

  if (router.isFallback) return <Loading />;
  const [ state, setState ] = useState({updated: false, stateData: data });
  const { updated, stateData } = state;
  const { events , user } = stateData;

  useEffect(() => {
    if (router.query.username && !updated) {
      getData(router.query.username).then((data) => {
        setState({updated: true, stateData:data})
      }).catch((error) => {
        console.error("Failed to fetch new data", error);
        setState({updated: true, stateData:stateData})
      });
    } 
  }, []);

  var eventsList = [];
  Object.keys(events).forEach((key) => {
    eventsList.push(events[key]);
  });

  return (
    <Layout>
      <div id="info">
        <Avatar
          className="w-32 h-32 text-4xl border rounded-full shadow mb-4"
          alt={user.user.fullname}
          src={user.user.avatar || "/fake-image.jpg"}>
        </Avatar>
      </div>

      <Board key={updated} events={eventsList} birthday={user.user.birthday} maxAge={user.user.maxAge}/>
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
