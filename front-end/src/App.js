import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MarketNews from './pages/MarketNews';
import Stocks from './pages/Stocks';
import Profile from './pages/Profile';
import Signup from './pages/Authentication/Signup';
import Login from './pages/Authentication/Login';
import Portfolio from './components/Portfolio/Portfolio'
import PortfolioBrief from './components/Portfolio/PortfolioBrief';
import StockSummary from './components/Stock/Summary';
import StockNews from './components/Stock/News';
import NotFoundPage from './pages/404';
import Agent from "./components/Agent/Agent";




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
        <Route key="stock_summary" path="/stock/summary" element={<StockSummary symbol="TSLA" name="Tesla, Inc" />} />
        <Route key="stock_news" path="/stock/news" element={<StockNews symbol="TSLA" name="Tesla, Inc" />} />
        <Route key="agent" path="/agent" element={<Agent />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
