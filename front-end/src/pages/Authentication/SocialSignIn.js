import React from 'react';
import {doSocialSignIn} from '../../firebase/FirebaseFunctions';

import google_img from "../../assets/imgs/google-signup-img.png";

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <img className = "signin-img"
        onClick={() => socialSignOn('google')}
        alt='Google signin'
        src="../../assets/imgs/google-signup-img.png"
      />
    </div>
  );
};

export default SocialSignIn;
