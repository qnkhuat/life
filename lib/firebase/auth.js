// Auth for client side
// https://www.freecodecamp.org/news/how-to-build-a-quizapp-using-nextjs-chakra-ui-and-firebase/
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from 'react';
import firebaseApp from './client';
import 'firebase/auth'; // to use firebaseApp.auth()
import axios from "axios";

const authContext = createContext({});

function useProvideAuth() {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthChange = async (authState) => {
    console.log("handle auth change", auth, user, loading);
    // this is also called on each refresh
    if (!authState) {
      setLoading(false);
      return;
    }
    console.log("start load");
    setLoading(true);
    authState.token = await authState.getIdToken();
    setAuth(authState);
    axios.defaults.headers.common = {'Authorization': `Bearer ${authState.token}`}
    if (!user) {
      console.log("trigger refresh");
      await refreshUser(authState) }
    setLoading(false);
  };

  const refreshUser = async (auth) => {
    console.log("refresh triggered");
    if(!auth) return;
    setLoading(true);

    axios.get(`/api/user?email=${auth.email}`).then((res) => {
      if (res.data) setUser(res.data);
    }).catch((error) => {
      console.log("Error ", error);
      return;
    }).finally(() => {
      console.log("yo");
      setLoading(false);
    });
  }

  const clear = () => {
    axios.defaults.headers.common = {'Authorization': `Bearer ${null}`}
    setAuth(null);
    setLoading(true);
    setUser(null);
  };

  const siginWithGoogle = async () => {
    setLoading(true);
    return firebaseApp
      .auth()
      .signInWithPopup(new firebaseApp.auth.GoogleAuthProvider()).then(() => {setLoading(false)});
  };

  const signOut = async () => {
    return firebaseApp.auth().signOut().then(clear);
  };

  useEffect(() => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged(handleAuthChange);
    return () => unsubscribe();
  }, []);

  return {
    auth,
    user,
    refreshUser,
    loading,
    siginWithGoogle,
    signOut,
  };
}

const useAuth = () => useContext(authContext); // for function components

export const withAuth = (WrappedComponent, authenticatedOnly=false, redirectTo="/login") => {
  return (props) => {
    const { auth, loading, user } = useAuth();
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(async () => {
      if (!loading){
        // This is a very primitive way to authenticate user. It's only check if the username in query equal user's username
        if (!auth || (authenticatedOnly && (!user || router.query.username != user.username))) {
          console.log(loading, auth, authenticatedOnly, user, router.query.username, user?.username);
          router.replace(redirectTo);
        }
        else setVerified(true);
      }
    }, [auth, loading]);

    if (verified) return <WrappedComponent {...props} />;
    else return null;
  };
};

export function AuthProvider({ children } ) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export { useAuth, authContext }; // for class components
