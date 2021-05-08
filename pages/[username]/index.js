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

export async function getServerSideProps(context) {
  const { username } = context.query;
  var events = null, user = null;
  try {
    const events_req = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${username}/stories`));
    const user_req = await axios.get(urljoin(process.env.BASE_URL, `/api/user/${username}`));
    events = events_req.data;
    user = user_req.data;
  } catch (error){
    return {
      notFound: true,
    }
  }
  
  return { props: { events: events, birthday: user.birthday, maxAge: user.maxAge } };
}

export default Profile;

