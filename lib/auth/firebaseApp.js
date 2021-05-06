import { default as firebaseApp } from 'firebase';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID
};

if (typeof window !== 'undefined' && !firebaseApp.apps.length) {
  console.log("Init firebase");
  firebaseApp.initializeApp(firebaseConfig);
}

export default firebaseApp;
