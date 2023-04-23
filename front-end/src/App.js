import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import MarketNews from './pages/MarketNews';
import Stocks from './pages/Stocks';
import Profile from './pages/Profile';
import Signup from './pages/Authentication/Signup'
import Login from './pages/Authentication/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route key="home" path="/" element={<Home />} />
        <Route key="search" path="/search" element={<Search />} />
        <Route key="market-news" path="/market-news" element={<MarketNews />} />
        <Route key="stocks" path="/stocks" element={<Stocks />} />
        <Route key="profile" path="/profile" element={<Profile />} />
        <Route key="signup" path="/signup" element={<Signup />} />
        <Route key="login" path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
