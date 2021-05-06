// https://www.freecodecamp.org/news/how-to-build-a-quizapp-using-nextjs-chakra-ui-and-firebase/
import { createContext, useContext, useEffect, useState } from 'react';
import firebaseApp from './firebase';

const authContext = createContext({
  auth: null,
  loading: true,
  siginWithGoogle: async () => {},
  signOut: async () => {},
});

const formatAuthState = (user) => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
  photoUrl: user.photoURL,
  token: null,
});

function useProvideAuth() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuthChange = async (authState) => {
    if (!authState) {
      setLoading(false);
      return;
    }
    const formattedAuth = formatAuthState(authState);
    formattedAuth.token = await authState.getIdToken();
    setAuth(formattedAuth);
    setLoading(false);
  };

  const signedIn = async (
    response,
    provider = 'google'
  ) => {
    if (!response.user) {
      throw new Error('No User');
    }
    const authUser = formatAuthState(response.user);
    console.log(response);
    console.log(authUser);
    //await addUser({ ...authUser, provider }); // TODO : call add user
  };

  const clear = () => {
    setAuth(null);
    setLoading(true);
  };

  const siginWithGoogle = async () => {
    setLoading(true);
    return firebaseApp
      .auth()
      .signInWithPopup(new firebaseApp.auth.GoogleAuthProvider())
      .then(signedIn);
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

export {useAuth,  authContext }; // for class components
