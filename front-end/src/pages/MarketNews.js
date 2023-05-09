import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import '../assets/css/style.css';
import MarketNewsComponent from '../components/MarketNews/MarketNews';

function MarketNews() {
  return (
    <div className="Home">
      <div className="containerGlass">
        <Sidebar />
        <MarketNewsComponent />
      </div>
    </div>
  );
}

export default MarketNews;