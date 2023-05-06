import React from 'react';
import { Navigate } from "react-router-dom";
import {signInWithGoogle, auth} from '../../firebase/FirebaseFunctions';

import google_img from "../../assets/imgs/google-signup-img.png";


const SocialSignIn = () => {
  const socialSignOn = async () => {
    try {
      let res = await signInWithGoogle();
      // console.log(res);
      console.log(auth.currentUser);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <>
      <div>
        <img className="signin-img"
          onClick={() => socialSignOn('google')}
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
