import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/firebase/auth';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import React from "react";

export default function Home (){
  const { auth, user, signOut, loading } = useAuth();
  const router = useRouter();
  if (loading) return <Loading/>;

  useEffect(() => {
    if (!auth && !loading) {
      router.push('/login?next=/');
    }
  }, [auth, loading]);

  return (
    <Layout>
      <p>{auth ? auth.name : "Stranger"}</p>
      <p>{auth ? auth.email: "Stranger Email"}</p>
      <p>{auth ? auth.token: "Stranger Token"}</p>
      <p>{user ? user.username: "Stranger username"}</p>
      <Button onClick={() => signOut()}>
        Log out
      </Button>
    </Layout>
  )
}
