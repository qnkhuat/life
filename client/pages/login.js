import { useRouter } from 'next/router';
import React, { useEffect } from "react";
import { useAuth } from '../lib/firebase/auth';
import Button from '@material-ui/core/Button';
import axios from "axios";

export default function Login() {
  const { auth, user, loading, signinWithGoogle } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if(auth && !loading){
      if (!user) router.push(`/profile?next=${router.query.next}`); 
      router.push(router.query.next || '/'); 
    }
  }, [auth, user]);

  return (
    <>
      <Button onClick={() => signinWithGoogle()}>
        Sign In with Google
      </Button>
    </>
  );
};

