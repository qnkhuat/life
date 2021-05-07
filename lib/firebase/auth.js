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
    if (!authState) {
      setLoading(false);
      return;
    }
    authState.token = await authState.getIdToken();
    axios.defaults.headers.common = {'Authorization': `Bearer ${authState.token}`}
    if (!user) {
      try {
        const user_req = await axios.get(`/api/user?email=${authState.email}`);
        setUser(user_req.data);
      } catch ( error ) {
        console.error("Error while fetching user info: ", error);
      }
    }
    setAuth(authState);
    setLoading(false);
  };

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
      .signInWithPopup(new firebaseApp.auth.GoogleAuthProvider());
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
        if (!auth || (authenticatedOnly && (!user || router.query.username != user.username))) router.replace(redirectTo);
        else setVerified(true);
      }
    }, [auth, loading]);

    if (verified) return <WrappedComponent {...props} />;
    else return null;
  };
};

export default withAuth;

export function AuthProvider({ children } ) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export { useAuth, authContext }; // for class components
