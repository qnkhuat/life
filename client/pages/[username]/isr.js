import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/Board';
import { useAuth, withAuth } from '../../lib/firebase/auth';
import urljoin from "url-join";

function Profile({ events, birthday, maxAge }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { auth } = useAuth();
  var eventsList = [];
  if (events == null){
    return (
      <h3>oh ho</h3>
    )
  }

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
  return { paths, fallback: true};
}


export async function getStaticProps({ params }) {
  const username = params.username;
  var events = {}, user = null;
  try {
    const user_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user?username=${username}`));
    user = user_res.data;
    const events_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${user.id}/stories`));
    events = events_res.data;
  } catch (error){
    return {
      notFound: true,
    }
  }
  return { 
    props: { events: events, birthday: user.user.birthday, maxAge: user.user.maxAge },
    revalidate: 1};
}

export default Profile;
