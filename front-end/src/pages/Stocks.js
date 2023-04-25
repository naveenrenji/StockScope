import React from 'react';
import RightSide from '../components/RigtSide/RightSide';
import Sidebar from '../components/Sidebar/Sidebar';
import '../assets/css/style.css';
import Portfolio from '../components/Portfolio/Portfolio';

function Stocks() {
  return (
    <div className="Home">
      <div className="HomeGlass">
        <Sidebar />
        <Portfolio />
        <RightSide />
      </div>
    </div>
  );
}

export default Stocks;