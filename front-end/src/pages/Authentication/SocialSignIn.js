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
        src={google_img}
        height={50}
        width={50}
      />
    </div>
  );
};

export default SocialSignIn;
