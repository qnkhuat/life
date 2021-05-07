import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/board';

function Profile({ events, birthday, maxAge }) {
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
  const [ events, user ] = await Promise.all([
    axios.get(`http://localhost:5001/mylife-stories/us-central1/api/user/${username}/stories`),
    axios.get(`http://localhost:5001/mylife-stories/us-central1/api/user/${username}`)
  ]);

  return { props: { events: events.data, birthday: user.data.birthday, maxAge: user.data.maxAge } };
}

export default Profile;

