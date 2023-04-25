import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MarketNews from './pages/MarketNews';
import Stocks from './pages/Stocks';
import Profile from './pages/Profile';
import Signup from './pages/Authentication/Signup';
import Login from './pages/Authentication/Login';
import PortfolioBrief from './components/Portfolio/PortfolioBrief';
import PortfolioDetails from './components/Portfolio/PortfolioDetails';
import NotFoundPage from './pages/404';


function App() {
  return (

    <Router>
      <Routes>
        <Route key="home" path="/" element={<Home />} />
        <Route key="market-news" path="/market-news" element={<MarketNews />} />
        <Route key="portfolio" path="/portfolio" element={<Stocks />} />
        <Route key="profile" path="/profile" element={<Profile />} />
        <Route key="signup" path="/signup" element={<Signup />} />
        <Route key="login" path="/login" element={<Login />} />
        <Route key="portfolio_brief" path="/portfolio/:name" element={<PortfolioBrief />} />
        <Route key="portfolio_detaiils" path="/portfolio/:name/v1" element={<PortfolioDetails />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
