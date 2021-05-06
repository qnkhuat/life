import {default as firebaseApp } from 'firebase';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNZHbgh37PoB_nl06nuuvt0B6D2kJNEbk",
  authDomain: "mylife-stories.firebaseapp.com",
  projectId: "mylife-stories",
  storageBucket: "mylife-stories.appspot.com",
  messagingSenderId: "571594077037",
  appId: "1:571594077037:web:318879812ca7da827aa064",
  measurementId: "G-BP92C03B5C"
};


if (typeof window !== 'undefined' && !firebaseApp.apps.length) {
  console.log("Init firebase");
  firebaseApp.initializeApp(firebaseConfig);
}

export default firebaseApp;
