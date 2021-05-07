// Auth for client side
// https://www.freecodecamp.org/news/how-to-build-a-quizapp-using-nextjs-chakra-ui-and-firebase/
import { createContext, useContext, useEffect, useState } from 'react';
import firebaseApp from './client';
import 'firebase/auth'; // to use firebaseApp.auth()
import axios from "axios";

const authContext = createContext({
  auth: null,
  loading: true,
  siginWithGoogle: async () => {},
  signOut: async () => {},
});

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
    console.log(authState.token);
    axios.defaults.headers.common = {'Authorization': `Bearer ${authState.token}`}
    try {
      const user_req = await axios.get(`/api/user?email=${authState.email}`);
      if (user_req.data) setUser(user_req.data);
    } catch (error) {
      console.log("Error :", error);
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

export function AuthProvider({ children } ) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export { useAuth, authContext }; // for class components
