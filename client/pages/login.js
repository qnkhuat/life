import { useRouter, useState } from 'next/router';
import React, { useEffect } from "react";
import { useAuth } from '../lib/firebase/auth';
import Button from '@material-ui/core/Button';

export default function Login() {
  const { auth, user, loading, signinWithGoogle } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if(auth && !loading){
      if (!user) router.push(`/settings?next=${router.query.next || "/"}`); 
      else router.push(router.query.next || '/'); 
    }
  }, [auth, user, loading]);

  return (
    <>
      <div id="signup" className="flex flex-col items-center place-content-center h-screen w-screen center">
        <div className ="md:border md:border-gray-300 md:p-10 md:shadow">
          <div className="mb-8">
            <div id="logo" className="w-44 mb-8 mx-auto">
              <img alt="logo" src="/logo-small.jpeg" className='w-full'/>
            </div>
            <p className='text-center font-bold'>Archive your life  
              <span> </span>
              <span className="text-lg font-bold text-red-500">s </span>
              <span className="text-lg font-bold text-yellow-500">t </span>
              <span className="text-lg font-bold text-yellow-400">o </span>
              <span className="text-lg font-bold text-green-500">r </span>
              <span className="text-lg font-bold text-green-400">i </span>
              <span className="text-lg font-bold text-blue-500">e </span>
              <span className="text-lg font-bold text-blue-400">s </span>
            </p>
          </div>
          <div id="provider" className="w-full flex flex-col place-content-center items-center">
            <div className="border border-gray-400 rounded w-52 md:w-64 text-center bg-black">
              <Button className="text-white normal-case w-full" onClick={() => signinWithGoogle().catch((error) => {console.log(error);})}>
                <img src="./google-icon.svg" alt="google-icon" className="w-4 h-4"/>
                <span className="pl-2">
                  Sign up using Google
                </span>
              </Button>
            </div>
            <div className="relative w-full">
              <div className="border-b border-gray-300 my-6 h-px w-4/5 mx-auto"></div>
              <p className="text-gray-600 absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-auto bg-white w-4 text-center px-2 text-sm">Or</p>
            </div>
            <div className="border border-gray-400 rounded w-52 md:w-64 text-center">
              <Button className="text-black normal-case w-full" onClick={() => signinWithGoogle().catch((error) => {console.log(error);})}>
                <img src="./google-icon.svg" alt="google-icon" className="w-4 h-4"/>
                <span className="pl-2">
                  Log in using Google
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
