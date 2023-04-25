import React from 'react';
import RightSide from '../components/RigtSide/RightSide';
import Sidebar from '../components/Sidebar/Sidebar';
import '../assets/css/style.css';
import MarketNewsComponent from '../components/MarketNews/MarketNews';

function MarketNews() {
  return (
    <div className="Home">
      <div className="HomeGlass">
        <Sidebar />
        <MarketNewsComponent />
        <RightSide />
      </div>
    </div>
  );
}

export default MarketNews;