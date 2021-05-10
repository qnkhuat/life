import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/Board';
import { useAuth, withAuth } from '../../lib/firebase/auth';
import urljoin from "url-join";
import { useEffect, useState } from "react";

const getData = async (username) => {
  const user_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user?username=${username}`));
  const user = user_res.data;
  const events_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${user.id}/stories`));
  const events = events_res.data;
  return {
    events:events,
    birthday: user.user.birthday,
    maxAge: user.user.maxAge,
  }
}

// Note on how this page render
// It uses ISR (Incremental static rendering)
// means every time the request comes, it'll return the cached
// HTML of this page, it will not process to render a new one
// In constrast it'll refresh the cache after (revalidate) seconds defined in getStaticProps return
// But inside the Profile after user access, It'll fetch data to make sure the page is up-to-date
//
// This is the best of both world: static make the site load fast. The second fetch make the site up-to-date
function Profile( { data }) {
  const router = useRouter();
  const [ state, setState ] = useState({updated: false, stateData: data });
  const { updated, stateData } = state;
  const { events , birthday, maxAge } = stateData;

  useEffect(() => {
    if (router.query.username && !updated) {
      getData(router.query.username).then((data) => {
        setState({updated: true, stateData:data})
      }).catch((error) => {
        console.log("failed to fetch new data");
      });
    }
  })

  var eventsList = [];
  Object.keys(events).forEach((key) => {
    eventsList.push(events[key]);
  });

  return (
    <div className="container mx-auto">
      <h3>{birthday}</h3>
      <Board key={updated} events={eventsList} birthday={birthday} maxAge={maxAge}/>
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
