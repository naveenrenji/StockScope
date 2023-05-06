import React, {useEffect, useState} from 'react';
import MainDash from '../components/MainDash/MainDash';
import RightSide from '../components/RigtSide/RightSide';
import Sidebar from '../components/Sidebar/Sidebar';
import { logout, auth } from "../firebase/FirebaseFunctions";
import '../assets/css/style.css';

function Home() {

  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    try{
      setCurrentUser(auth.currentUser)
      console.log(currentUser, currentUser.providerId);
    } catch(e){
      
    }
    
  }, [auth]);

  return (
    <div className="Home">
      <div className="HomeGlass">
        <Sidebar />
        <MainDash />
        <RightSide />
      </div>
    </div>
  );
}

export default Home;