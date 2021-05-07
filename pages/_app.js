import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { AuthProvider } from '../lib/auth';
import axios from "axios";
axios.defaults.headers.post['Content-Type'] = 'application/json';
require('dotenv').config()

function MyApp({ Component, pageProps }) {
  return <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
}

export default MyApp
