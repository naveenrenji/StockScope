import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfiguration';
import google_img from "../../assets/imgs/google-signup-img.png";


const SocialSignIn = () => {
  // Login with Google
  const navigate = useNavigate();

  const onGoogleSignIn = (e) => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const googleuser = result.user;
        navigate("/");
        console.log(googleuser);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <>
      <div>
        <img className="signin-img"
          onClick={() => onGoogleSignIn('google')}
          alt='Google signin'
          src={google_img}
          height={50}
          width={50}
        />
      </div>
    </>
  );
};

export default SocialSignIn;
