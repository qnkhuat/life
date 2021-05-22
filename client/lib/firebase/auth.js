// Auth for client side
// https://www.freecodecamp.org/news/how-to-build-a-quizapp-using-nextjs-chakra-ui-and-firebase/
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from 'react';
import { auth as firebaseAuth } from './client';
import axios from "axios";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignout } from 'firebase/auth';
import { deepClone } from "../util";
import urljoin from "url-join";
import nookies from 'nookies';

const authContext = createContext({});

function useProvideAuth() {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthChange = async (authState) => { 
    // this handler is also being called on each refresh
    if (!authState) {
      setLoading(false);
      return;
    }
    authState.token = await authState.getIdToken();
    setAuth(authState);
    axios.defaults.headers.common = {'Authorization': `Bearer ${authState.token}`}
    if (!user){
      var cookies = parseCookies();
      if(! cookies.hasOwnProperty("user")) {
        await refreshUser(authState);
      } else {
        const userInfo = JSON.parse(cookies.user);
        setUser(userInfo);
        setLoading(false);
      }
    }
  };

  const refreshUser = (auth) => {
    if(!auth) return;
    setLoading(true);
    return axios.get(urljoin(process.env.API_URL, `/api/user/${auth.uid}`)).then((res) => {
      if (res.data) {
        setUser(res.data);
        setCookie(null, "user", JSON.stringify(res.data), {
          maxAge: 24*60*60, // in seconds
          path: '/',
        });
        // deep clone the result to prevent set User state accidently 
        // when the using function try to modify it
        return deepClone(res.data);  
      }
    }).catch((error) => {
      return null;
    }).finally(() => {
      setLoading(false);
    });
  }

  const clear = async () => {
    axios.defaults.headers.common = {'Authorization': `Bearer ${null}`}
    setAuth(null);
    destroyCookie(null, "user");
    setUser(null);
    setLoading(true);
  };
  
  const signinWithGoogle = async () => {
    setLoading(true);
    return signInWithPopup(firebaseAuth, new GoogleAuthProvider());
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
        if (!auth || ( authorizedOnly && (!user || router.query.username != user.username))) {
          router.push(redirectTo);
        }
        else setVerified(true);
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
