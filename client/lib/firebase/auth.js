// Auth for client side
// https://www.freecodecamp.org/news/how-to-build-a-quizapp-using-nextjs-chakra-ui-and-firebase/
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from 'react';
import { auth as firebaseAuth } from './client';
import axios from "axios";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignout } from 'firebase/auth';
import urljoin from "url-join";
import nookies from 'nookies';

const authContext = createContext({});

function useProvideAuth() {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthChange = async (authState) => { 
    // this is also called on each refresh
    if (!authState) {
      setLoading(false);
      return;
    }
    authState.token = await authState.getIdToken();
    setAuth(authState);
    axios.defaults.headers.common = {'Authorization': `Bearer ${authState.token}`}
    var cookies = parseCookies();
    if (! user){
      if(! cookies.hasOwnProperty("user")) await refreshUser(authState);
      else {
        const userInfo = "user" in cookies ? JSON.parse(cookies.user) : null;
        setUser(userInfo);
      }
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    if(!auth) return;
    return await axios.get(urljoin(process.env.BASE_URL, `/api/user/${auth.uid}`)).then((res) => {
      if (res.data) {
        setUser(res.data);
        setCookie(null, "user", JSON.stringify(res.data), {
          maxAge: 30*24*60*60, // in seconds
          path: '/',
        });
      }
      return res.data;
    }).catch((error) => {
      console.log("Failed to get user info: ", error);
      return;
    });
  }

  const clear = () => {
    axios.defaults.headers.common = {'Authorization': `Bearer ${null}`}
    setAuth(null);
    setLoading(true);
    destroyCookie(null, "user");
    setUser(null);
  };

  const signinWithGoogle = async () => {
    setLoading(true);
    return signInWithPopup(firebaseAuth, new GoogleAuthProvider());;
  };


  const signOut = async () => {
    return firebaseSignout(firebaseAuth).then(clear);
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, handleAuthChange);
    return () => unsubscribe();
  }, []);

  return {
    auth,
    user,
    refreshUser,
    loading,
    signinWithGoogle,
    signOut,
  };
}

const useAuth = () => useContext(authContext); // for function components

export const withAuth = (WrappedComponent, authorizedOnly=false, redirectTo="/login") => {
  return (props) => {
    const { auth, user, loading } = useAuth();
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(async () => {
      if (!loading){
        // This is a very primitive way to authenticate user. It's only check if the username in query equal user's username
        if (!auth || (authorizedOnly&& (!user || router.query.username != user.username))) {
          router.replace(redirectTo);
        }
        else {
          setVerified(true);
        }
      }
    }, [auth, loading, user]);

    if (verified) return <WrappedComponent {...props} />;
    else return null;
  };
};

export function AuthProvider({ children } ) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export { useAuth, authContext }; // for class components
