import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { AuthProvider } from '../lib/firebase/auth';
import Router from 'next/router';
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from 'next/router';
import { useAuth } from "../lib/firebase/auth";

axios.defaults.headers.post['Content-Type'] = 'application/json';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp;
