import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../lib/auth';
import Button from '@material-ui/core/Button';

const signin = () => {
  const { auth, siginWithGoogle } = useAuth();
  const router = useRouter();

  if (auth) {
    router.push(router?.query.next || '/');
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
