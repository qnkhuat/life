import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/Board';
import { useAuth, withAuth } from '../../lib/firebase/auth';
import urljoin from "url-join";

function Profile({ events, birthday, maxAge }) {
  const { auth } = useAuth();
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

export async function getStaticProps({ params }) {
  const username = params.username;
  var events = null, user = null;
  try {
    const events_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${username}/stories`));
    const user_res = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${username}`));
    events = events_res.data;
    user = user_res.data;
  } catch (error){
    return {
      notFound: true,
    }
  }
  
  return { props: { events: events, birthday: user.birthday, maxAge: user.maxAge } };
}

export default Profile;


export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const user_res = await axios.get(urljoin(process.env.BASE_URL, `/api/usernames`));

  // Get the paths we want to pre-render based on posts
  const paths = user_res.data.map((username) => ({
    params: { username: username},
  }))
  console.log("paths");
  console.log(paths);

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
