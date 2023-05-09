import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import '../assets/css/style.css';
import Portfolio from '../components/Portfolio/Portfolio';

function Stocks() {
  return (
    <div className="Home">
      <div className="containerGlass">
        <Sidebar />
        <Portfolio />
      </div>
    </div>
  );
}

export default Stocks;