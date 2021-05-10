import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/Board';
import urljoin from "url-join";
import { useEffect, useState } from "react";

const getData = async (username) => {
  const user_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user?username=${username}`));
  const user = user_res.data;
  const events_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${user.id}/stories`));
  const events = events_res.data;
  const result  = {
    events:events,
    user: user,
  }
  return result;
}

// Note on how this page render
// It uses ISR (Incremental static rendering)
// means every time the request comes, it'll return the cached
// HTML of this page, it will not process to render a new one
// In constrast it'll refresh the cache after (revalidate) seconds defined in getStaticProps return
// But inside the Profile after user access, It'll fetch data to make sure the page is up-to-date
//
// This is the best of both world: static make the site load fast. The second fetch make the site up-to-date
function Profile({ data }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>loading...</div>
  }
  const [ state, setState ] = useState({updated: false, stateData: data });
  const { updated, stateData } = state;
  const { events , user } = stateData;

  useEffect(() => {
    if (router.query.username && !updated) {
      getData(router.query.username).then((data) => {
        setState({updated: true, stateData:data})
      }).catch((error) => {
        console.error("Failed to fetch new data", error);
      });
    }
  })

  var eventsList = [];
  Object.keys(events).forEach((key) => {
    eventsList.push(events[key]);
  });

  return (
    <div className="container mx-auto">
      <Board key={updated} events={eventsList} birthday={user.user.birthday} maxAge={user.user.maxAge}/>
    </div>
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

export default Profile;
