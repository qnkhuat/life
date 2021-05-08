// Auth for client side
// https://www.freecodecamp.org/news/how-to-build-a-quizapp-using-nextjs-chakra-ui-and-firebase/
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from 'react';
import { auth as firebaseAuth } from './client';
import axios from "axios";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignout } from 'firebase/auth';

const authContext = createContext({});

function useProvideAuth() {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthChange = async (authState) => {
    console.log("handle auth change");
    // this is also called on each refresh
    if (!authState) {
      setLoading(false);
      return;
    }
    authState.token = await authState.getIdToken();
    setAuth(authState);
    axios.defaults.headers.common = {'Authorization': `Bearer ${authState.token}`}
    await refreshUser(authState);
    setLoading(false);
  };

  const refreshUser = async (auth) => {
    if(!auth) return;
    console.log("Refresh user");
    await axios.get(`/api/user?email=${auth.email}`).then((res) => {
      if (res.data) setUser(res.data);
    }).catch((error) => {
      return;
    });
  }

  const clear = () => {
    axios.defaults.headers.common = {'Authorization': `Bearer ${null}`}
    setAuth(null);
    setLoading(true);
    setUser(null);
  };

  const signinWithGoogle = async () => {
    setLoading(true);
    return signInWithPopup(firebaseAuth, new GoogleAuthProvider()).then(() => {setLoading(false)});
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

export const withAuth = (WrappedComponent, authenticatedOnly=false, redirectTo="/login") => {
  return (props) => {
    const { auth, loading, user } = useAuth();
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(async () => {
      if (!loading){
        // This is a very primitive way to authenticate user. It's only check if the username in query equal user's username
        if (!auth || (authenticatedOnly && (!user || router.query.username != user.username))) {
          router.replace(redirectTo);
        }
        else {
          setVerified(true);
        }
      }
    }, [auth, user, loading]);

    if (verified) return <WrappedComponent {...props} />;
    else return null;
  };
};

export function AuthProvider({ children } ) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export { useAuth, authContext }; // for class components
