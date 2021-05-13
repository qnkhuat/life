import Link from "next/link";
import { useAuth } from "../lib/firebase/auth"; 
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useDeviceDetect from "../lib/device";
import Div100vh from 'react-div-100vh';


export default function Layout({ children }) {
  const { user } = useAuth();
  // TODO : understand why this is being re-rendered everytime children re-render

  return (
    <Div100vh className={`flex flex-col justify-between md:flex-col-reverse md:justify-end`}>
      <div className="overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto">
        {children && children}
      </div>
      </div>
      <div id="navbar"
        className={`flex justify-around border-t md:border-b bg-white`}>
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
          href="/search"
          passHref>
          <IconButton
            className="text-gray-700 outline-none rounded p-2 w-14"
            onClick={() => {}}
            aria-label="Search">
            <SearchIcon></SearchIcon>
          </IconButton>
        </Link>
        <Link
          href={`/${user ? user.user.username : "settings"}`}
          passHref>
          <IconButton
            className="text-gray-700 outline-none rounded p-2 w-14"
            onClick={() => {}}
            aria-label="Account">
            <AccountCircleIcon></AccountCircleIcon>
          </IconButton>
        </Link>
      </div>
    </Div100vh>
  )
}
