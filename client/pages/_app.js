import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { AuthProvider } from '../lib/auth';

function MyApp({ Component, pageProps }) {
  return <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
}

export default MyApp
