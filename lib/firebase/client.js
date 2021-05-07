// Contain firebase storage to use at client side
import { default as firebaseApp } from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID
};

var storage;
if (typeof window !== 'undefined' && !firebaseApp.apps.length) {
  console.log("Init firebase");
  firebaseApp.initializeApp(firebaseConfig);
  storage = firebaseApp.storage();
}
export { storage };
export default firebaseApp;
