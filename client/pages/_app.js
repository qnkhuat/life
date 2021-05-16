import '../styles/globals.css';
import Head from 'next/head';
import { AuthProvider } from '../lib/firebase/auth';
import axios from "axios";

axios.defaults.headers.post['Content-Type'] = 'application/json';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>The life book</title>
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}

export default MyApp;
