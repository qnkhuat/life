// Contain firebase storage to use at client side
// https://firebase.google.com/docs/reference/js/v9/auth.googleauthprovider
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, useAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID
};

var auth, storage, firestore;
if (typeof window !== 'undefined' && getApps().length == 0) {
  console.log("Init app");
  initializeApp(firebaseConfig);
  auth = getAuth();
  firestore = getFirestore();
  storage = getStorage();
  //useAuthEmulator(auth, "http://localhost:9099");
}
export { auth, storage, firestore };
