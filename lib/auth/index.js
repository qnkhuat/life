// https://www.freecodecamp.org/news/how-to-build-a-quizapp-using-nextjs-chakra-ui-and-firebase/
import { createContext, useContext, useEffect, useState } from 'react';
import firebaseApp from './firebaseApp';
import axios from "axios";

const authContext = createContext({
  auth: null,
  loading: true,
  siginWithGoogle: async () => {},
  signOut: async () => {},
});

function useProvideAuth() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuthChange = async (authState) => {
    if (!authState) {
      setLoading(false);
      return;
    }
    authState.token = await authState.getIdToken();
    setAuth(authState);
    setLoading(false);
  };

  const clear = () => {
    setAuth(null);
    setLoading(true);
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
