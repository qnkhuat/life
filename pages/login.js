import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../lib/firebase/auth';
import Button from '@material-ui/core/Button';
import axios from "axios";

const signin = () => {
  const { auth, siginWithGoogle } = useAuth();
  const router = useRouter();
  if (auth) {
    // First check whether user is added to database. if not direct to info page so you can add
    axios.get(`/api/user?email=${auth.email}`).catch(( error ) => {
      router.push(`/info?next=${router.query.next}`); 
    });
    // 2nd if has redirect request then driect there
    // 3rd to home page as default
    // Order matter here
    router.push(router.query.next || '/'); 
  }

  return (
    <>
      <Button onClick={() => siginWithGoogle()}>
        Sign In with Google
      </Button>
    </>
  );
};

export default signin;
