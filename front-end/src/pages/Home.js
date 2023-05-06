import React from 'react';
import MainDash from '../components/MainDash/MainDash';
import RightSide from '../components/RigtSide/RightSide';
import Sidebar from '../components/Sidebar/Sidebar';
import '../assets/css/style.css';

function Home() {

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