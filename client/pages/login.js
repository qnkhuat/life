
import { useRouter } from 'next/router';
import React, { useEffect } from "react";
import { useAuth } from '../lib/firebase/auth';
import Button from '@material-ui/core/Button';

export default function Login() {
  const { auth, user, loading, signinWithGoogle } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if(auth && !loading){
      if (!user) router.push(`/profile?next=${router.query.next}`); 
      router.push(router.query.next || '/'); 
    }
  }, [auth, user, loading]);

  return (
    <>
      <div id="signup" className="flex flex-col items-center place-content-center h-screen w-screen pb-10">
        <div className="mb-8">
          <div id="logo" className="w-44 mb-8 mx-auto">
            <img alt="logo" src="/logo-small.jpeg" className='w-full'/>
          </div>
          <p className='text-center'>Archive your life  
          <span> </span>
          <span className="text-red-500">s </span>
          <span className="text-yellow-500">t </span>
          <span className="text-yellow-400">o </span>
          <span className="text-green-500">r </span>
          <span className="text-green-400">i </span>
          <span className="text-blue-500">e </span>
          <span className="text-blue-400">s </span>
          </p>
        </div>
        <div id="provider" className="w-full flex flex-col place-content-center items-center">
          <div className="border border-gray-400 rounded w-40 text-center bg-black">
            <Button className="text-white normal-case w-full" onClick={() => signinWithGoogle().catch((error) => {console.log(error);})}>
              <img src="./google-icon.svg" alt="google-icon" className="w-4 h-4"/>
              <span className="pl-2">
                Sign Up
              </span>
            </Button>
          </div>
          <div className="relative w-full">
            <div className="border-b border-gray-300 my-6 h-px w-4/5 mx-auto"></div>
            <p className="text-gray-600 absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-auto bg-white w-4 text-center px-2 text-sm">Or</p>
          </div>
          <div className="border border-gray-400 rounded w-40 text-center">
            <Button className="text-black normal-case w-full" onClick={() => signinWithGoogle().catch((error) => {console.log(error);})}>
              <img src="./google-icon.svg" alt="google-icon" className="w-4 h-4"/>
              <span className="pl-2">
                Sign In
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
