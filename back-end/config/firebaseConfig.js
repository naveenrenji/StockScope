// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEuEM5AxTB_nMQJ5HjTSH8iyiZvOuFstQ",
  authDomain: "stockscope-1b276.firebaseapp.com",
  projectId: "stockscope-1b276",
  storageBucket: "stockscope-1b276.appspot.com",
  messagingSenderId: "1031255864443",
  appId: "1:1031255864443:web:5b8ef86458835022579ede",
  measurementId: "G-4K8768LCM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);