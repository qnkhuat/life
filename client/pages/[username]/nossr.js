import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import axios from "axios";
import Board from '../../components/Board';
import { useAuth, withAuth } from '../../lib/firebase/auth';
import urljoin from "url-join";
import { useState, useEffect } from 'react';

function Profile() {
  const router = useRouter();

  const [ state, setState ] = useState({
    loading:true,
    eventsList: [],
    birthday: null,
    maxAge:null,
  });

  useEffect(() => {
    if (state.loading && router.query.username) {
        axios.get(urljoin(process.env.BASE_URL, `/api/user?username=${router.query.username}`)).then((res) => {
        const user = res.data;
        axios.get(urljoin(process.env.BASE_URL, `/api/user/${user.id}/stories`)).then((res) => {
          const events = res.data;
          var eventsTemp = [];
          Object.keys(events).forEach((key) => {
            eventsTemp.push(events[key]);
          });
          setState({
            loading:false,
            eventsList: eventsTemp,
            birthday: user.user.birthday,
            maxAge: user.user.maxAge,
          })
        }).catch((error) => {
          console.error("Failed to get user stories", error.message);
          router.push("/404");
        });
      }).catch((error) => {
        console.log("User not found ", error);
        router.push("/404")
      });
    }
  }, [state, router])

  if (state.loading) {
    return (<h3> Loading </h3>)
  }
  return (
    <div className="container mx-auto">
      <Board events={state.eventsList} 
        birthday={state.birthday} 
        maxAge={state.maxAge}/>
    </div>
  )
}


export default dynamic(() => Promise.resolve(Profile), {
  ssr: false
})

