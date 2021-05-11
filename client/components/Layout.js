import Link from "next/link";
import { useAuth } from "../lib/firebase/auth"; 
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useDeviceDetect from "../lib/device";
export default function Layout({ children }) {
  const { user } = useAuth();
  const { isMobile }= useDeviceDetect();
  const temp = "fixed w-screen bottom-0 left-0 z-10 overflow-hidden";
  return (
    <div className={`flex ${isMobile() ? "flex-col" : "flex-col-reverse"} h-screen justify-between`}>
      <div className="overflow-auto">
        {children && children}
      </div>
      <div id="navbar"
        className={`flex justify-around ${isMobile() ? "border-t" : "border-b"} bg-white`}>
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
          href={`/${user.user.username}`}
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
  )
}
