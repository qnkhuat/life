import { useState } from "react";
import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import React from "react";
import axios from "axios"
import urljoin from "url-join";
import { findBestMatch } from "string-similarity";

import Avatar from '@material-ui/core/Avatar';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

import Layout from '../components/Layout';
import Loading from '../components/Loading';
import CustomTextField from '../components/TextField';
import { useAuth } from '../lib/firebase/auth';
import { formatAge, formatMultilineText } from '../lib/util';


export default function Home ({ users }){
  const { auth, user, signOut, loading } = useAuth();
  const [ userIdsList, setUserIdsList ] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading) {
      router.push('/login?next=/');
    }
  }, [auth, loading]);

  const [newSearch, setNewSearch] = useState(false);
  
  async function handleSearch(e){
    setNewSearch(true);
    // on average typing speed is 40wpm. with average of 4 chars per word
    // => 500ms per character
    // so for each type we will set at time out of 600ms to search
    // if user type righ after that, the search will be cancled due to setNewSearch(true)
    // but if not the setTimeout to setNewSearch(false) is in just 500ms which will fire before the search is fired
    // this will make the search execute
   
    setTimeout(() => {
      setNewSearch(false);
    }, 500);

    setTimeout(() => {
      if (newSearch) {
        console.log("cannceld search");
        return;
      }
      const value = e.target.value;
      const allUserIds = Object.keys(users);
      if (!value || value == "") setUserIdsList(Object.keys(users).sort((a, b) => 0.5 - Math.random()));

      const usernamesList =  allUserIds.map((userId) => users[userId].username);
      const fullnamesList =  allUserIds.map((userId) => users[userId].fullname);

      var usernamesRating = findBestMatch(value, usernamesList).ratings;
      usernamesRating.forEach((e) => e.type= "username");

      var fullnameRatings = findBestMatch(value, fullnamesList).ratings
      fullnameRatings.forEach((e) => e.type= "fullname");

      var mergeRatings = usernamesRating.concat(fullnameRatings);
      mergeRatings.sort((a, b) => b.rating - a.rating); // sort descending

      var matchedUserIdsList = [];
      function findUniqueUserIds(value, type) {
        const result = Object.keys(users).filter((userId) => !matchedUserIdsList.includes(userId) && users[userId][type] == value);
        return result;
      }

      for (let e of mergeRatings){
        if (e.rating < .6) break;
        matchedUserIdsList = matchedUserIdsList.concat(findUniqueUserIds(e.target, e.type));
      }

      if (matchedUserIdsList.length != 0) setUserIdsList(matchedUserIdsList);
    }, 600);
  }
  useEffect(() => { 
    // since this is static page so Nextjs doesn't allow to random at render time
    // random order before render to avoid this warning
    setUserIdsList(Object.keys(users).sort((a, b) => 0.5 - Math.random()));
  }, [])

  if (!userIdsList) return <Loading/>

    return (
      <Layout>
        <CustomTextField id="search-username" 
          className="w-full "
          label="Search" 
          variant="standard" 
          onChange={handleSearch}
          InputProps={{
            endAdornment: <InputAdornment position="end"><SearchIcon></SearchIcon></InputAdornment>,
          }}
        />

        {
          userIdsList.map((userId) => (
            <div key={userId} className="flex flex-col relative w-full border-b-2 py-4">
              <div className="flex w-fulll">
                <Avatar
                  className="w-24 h-24 text-4xl torder rounded-full shadow mr-4"
                  alt={users[userId].fullname}
                  src={users[userId].avatar || "/fake-image.jpg"}>
                </Avatar>
                <div id="info-text" className='flex flex-col justify-center w-auto'>
                  <Link href={`/${users[userId].username}`} passHref>
                    <a className="font-bold text-lg font-underline">{users[userId].fullname}</a>
                  </Link>
                  <p className="text-xs">@{users[userId].username}</p>
                  <p className="text-sm">{formatAge(users[userId].birthday)}</p>
                  {users[userId].about && <p className="text-sm w-auto"
                  >{users[userId].about}</p>}
                </div>
              </div>
            </div>)
          )
        }
      </Layout>
    )
}

export async function getStaticProps({ params }) {
  var users = {};
  try {
    const users_res = await axios.get(urljoin(process.env.API_URL, `/api/users`));
    users = users_res.data;
  } catch (error) {
    console.error("Fail to fetch users",error);
    return {
      notFound: true,
    }
  }
  return {
    props: {users : users},
    revalidate : 10,
  }
}
