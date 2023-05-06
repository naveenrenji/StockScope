import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyBR3pn-0Ozmvyw_GQlEEFQhHiEW5vzLsIo",
    authDomain: "stocksscope.firebaseapp.com",
    projectId: "stocksscope",
    storageBucket: "stocksscope.appspot.com",
    messagingSenderId: "419796884417",
    appId: "1:419796884417:web:ae053a4dc52fbf30652d40",
    measurementId: "G-3ELQWJG66Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
setPersistence(auth, localStorage)

export const googleProvider = new GoogleAuthProvider();
export default app;