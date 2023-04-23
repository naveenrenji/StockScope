import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyDEuEM5AxTB_nMQJ5HjTSH8iyiZvOuFstQ",
  authDomain: "stockscope-1b276.firebaseapp.com",
  projectId: "stockscope-1b276",
  storageBucket: "stockscope-1b276.appspot.com",
  messagingSenderId: "1031255864443",
  appId: "1:1031255864443:web:5b8ef86458835022579ede",
  measurementId: "G-4K8768LCM4"
});

export default firebaseConfig;
