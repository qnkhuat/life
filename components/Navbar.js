import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../lib/auth';
import Button from '@material-ui/core/Button';

const Navbar: React.FC<{}> = () => {
  const { auth, signOut } = useAuth();
  const router = useRouter();

  return (
    <>
      {auth ? (
        <Button
          onClick={() => router.push('/quiz/new')}
        >
          Add new quiz
        </Button>
          <Button onClick={() => signOut()}>
            Logout
          </Button>
      ) : (
        <Button
          onClick={() => router.push('/signin')}
        >
          Sign In
        </Button>
      )}
      />
    </>
  );
};

export default Navbar;
