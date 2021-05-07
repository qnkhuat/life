import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { AuthProvider } from '../lib/firebase/auth';
import Router from 'next/router';
import NProgress from 'nprogress';
import axios from "axios";
axios.defaults.headers.post['Content-Type'] = 'application/json';

NProgress.configure({ showSpinner: true });

Router.onRouteChangeStart = () => {
  // console.log('onRouteChangeStart triggered');
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  // console.log('onRouteChangeComplete triggered');
  NProgress.done();
};

Router.onRouteChangeError = () => {
  // console.log('onRouteChangeError triggered');
  NProgress.done();
};


function MyApp({ Component, pageProps }) {
  return <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
}

export default MyApp;
