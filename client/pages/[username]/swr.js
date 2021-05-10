import useSWR from "swr";
import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/Board';
import { useAuth, withAuth } from '../../lib/firebase/auth';
import urljoin from "url-join";

const fetcher = async (username) => {
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

function Profile( props ) {

  const router = useRouter();
  const { data } = useSWR(router.query.username, fetcher, { initialData: props.data }, , { refreshInterval: 1000 });
  if (!data){
    return (
      <h3>oh ho</h3>
    )
  }

  const { events, birthday, maxAge } = data;

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  var eventsList = [];
  
  Object.keys(events).forEach((key) => {
    eventsList.push(events[key]);
  });

  return (
    <div className="container mx-auto">
      <Board events={eventsList} birthday={birthday} maxAge={maxAge}/>
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
    data = await fetcher(username);
  } catch (error){
    return {
      notFound: true,
    }
  }
  return { 
    props: {data:data},
    revalidate:1
  };
}

export default Profile;
