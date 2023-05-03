import React from 'react';
import MainDash from '../components/MainDash/MainDash';
import RightSide from '../components/RigtSide/RightSide';
import Sidebar from '../components/Sidebar/Sidebar';
import '../assets/css/style.css';
import ChatBot from '../components/ChatBot/ChatBot';
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="Home">
      <div className="HomeGlass">
        <Sidebar />
        <MainDash />
        <RightSide />
        <ChatBot />
        <Link to="/agent">Talk to an Agent</Link>

      </div>
    </div>
  );
}

export default Home;