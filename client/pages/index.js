import { useState } from "react";
import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import React from "react";
import axios from "axios"
import urljoin from "url-join";
import Avatar from '@material-ui/core/Avatar';

import Layout from '../components/Layout';
import Loading from '../components/Loading';
import { useAuth } from '../lib/firebase/auth';
import { formatAge, formatMultilineText } from '../lib/util';

export default function Home ({ users }){
  const { auth, user, signOut, loading } = useAuth();
  const [ usersList, setUsersList ] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading) {
      router.push('/login?next=/');
    }
  }, [auth, loading]);

  useEffect(() => { 
    // since this is static page so Nextjs doesn't allow to random at render time
    // random order before render to avoid this warning
    setUsersList(Object.keys(users).sort((a, b) => 0.5 - Math.random()));
  }, [])

  if (!usersList) return <Loading/>

  return (
    <Layout>
      {
        usersList.map((userId) => (
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
