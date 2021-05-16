import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';

import useDeviceDetect from "../lib/device";
import { useAuth } from "../lib/firebase/auth"; 
import Div100vh from "react-div-100vh";

export default function Layout({ children, copyright=true }) {
  const { user } = useAuth();
  const router = useRouter();
  const [redirectRoute, setRedirectRoute] = useState("/settings");
  useEffect(() => {
    setRedirectRoute(user?.user?.username ? user.user.username : "settings");
  }, [user]);
  return (
    <>
      <div id="navbar-mobile" className="md:hidden fixed top-0 left-0 flex justify-between border-b bg-white z-10 w-full">
        <IconButton
          className="text-gray-700 outline-none rounded p-2 w-14"
          onClick={() => router.back()}
          aria-label="Back">
          <ArrowBackIcon></ArrowBackIcon>
        </IconButton>
        <Link
          href={`/${user ? "settings" : "login"}`}
          passHref>
          <IconButton
            className="text-gray-700 outline-none rounded p-2 w-14"
            aria-label="Settings">
            <SettingsIcon></SettingsIcon>
          </IconButton>
        </Link>
      </div>

      <div id="body" className="py-10 md:pb-0">
        <div className="container mx-auto px-4 overflow-x-hidden md:w-desktop">
          {children && children}
        </div>
        {copyright &&
        <div id="footer" 
          className="pb-4" >
          <p id="copy-right" className="mt-4 text-center text-gray-500 text-xs">© {new Date().getFullYear()} The life book</p>
        </div>
        }

      </div>
            <div id="navbar-main"
        className={`border-t md:border-b bg-white w-full z-10 fixed bottom-0 left-0 md:top-0 md:bottom-auto`}>
        <div className="container flex justify-between m-auto md:w-desktop">
          <Link
            href="/"
            passHref>
            <Button
              className="text-gray-700 outline-none p-2 w-14 overflow-hidden"
              component="a"
              onClick={() => {}}
              aria-label="Home">
              <img className="w-6" src="/Tilde.svg" alt="logo"></img>
            </Button>
          </Link>
          <Link
            href={`/${redirectRoute}`}
            passHref>
            <IconButton
              className="text-gray-700 outline-none rounded p-2 w-14"
              onClick={() => {}}
              aria-label="Account">
              <AccountCircleIcon></AccountCircleIcon>
            </IconButton>
          </Link>
        </div>
      </div>
    </>
  )
}
