import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/Board';
import { useAuth, withAuth } from '../../lib/firebase/auth';
import urljoin from "url-join";
import { useState, useEffect } from 'react';

function Profile() {
  const router = useRouter();

  const [ eventsList, setEventsList ] = useState([]);
  const [ birthday, setBirthday ] = useState("1998-05-17");
  const [ maxAge, setMaxAge ] = useState(100);
  const [ user, setUser ] = useState({});

  useEffect(() => {
    if (user == null) {
      axios.get(urljoin(process.env.BASE_URL, `/api/user?username=qnkhuat`)).then((res) => {
        const userInfo = res.data.user;
        setUser(userInfo);
        setBirthday(user.birthday);
        setMaxAge(user.maxAge);
        axios.get(urljoin(process.env.BASE_URL, `/api/user/${user.id}/stories`)).then((res) => {
          const events = res.data;
          const eventsTemp = [];
          Object.keys(events).forEach((key) => {
            eventsTemp.push(events[key]);
          });
          setEventsList([]);
        }).catch((error) => {
          console.error("Failed to get user stories", error);
          router.push("/404");
        });

      }).catch((error) => {
        console.log("User not found ", error);
        router.push("/usernotfound")
      });
    }
  })

  if (user == null) {
    return (<h3> Loading </h3>)
  }


  return (
    <div className="container mx-auto">
      <Board events={eventsList} birthday={birthday} maxAge={maxAge}/>
    </div>
  )
}

export default Profile;
