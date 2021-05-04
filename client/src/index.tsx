import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import logo from './logo.svg';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCNZHbgh37PoB_nl06nuuvt0B6D2kJNEbk",
  authDomain: "mylife-stories.firebaseapp.com",
  projectId: "mylife-stories",
  storageBucket: "mylife-stories.appspot.com",
  messagingSenderId: "571594077037",
  appId: "1:571594077037:web:318879812ca7da827aa064",
  measurementId: "G-BP92C03B5C"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
else firebase.app();

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/signedIn',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
};

function SignInScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user:any) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome, you're {firebase?.auth()?.currentUser?.displayName} now sgined in</p>
      <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <SignInScreen />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
