import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MarketNews from "./pages/MarketNews";
import Stocks from "./pages/Stocks";
import Signup from "./pages/Authentication/Signup";
import Login from "./pages/Authentication/Login";
import PortfolioBrief from "./components/Portfolio/PortfolioBrief";
import StockSummary from "./components/Stock/Summary";
import StockNews from "./components/Stock/News";
import NotFoundPage from "./pages/404";
import HistoricalData from "./components/Stock/HistoricalData";
import Agent from "./components/Agent/Agent";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfiguration";

function AuthenticationHandler() {
  const [userIsAgent, setUserIsAgent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        const uid = user.uid;
        console.log("uid", user);
        if (user.email === 'stockscope2023@gmail.com') {
          setUserIsAgent(true);
        }
        else {
          setUserIsAgent(false)
        }
      }
    });
    return unsubscribe;
  }, [auth]);

  return userIsAgent ? (
    <Routes>
      <Route key="agent" path="/agent" element={<Agent />} />
      <Route key="signup" path="/signup" element={<Signup />} />
      <Route key="login" path="/login" element={<Login />} />
      <Route path="*" element={<Agent />} />
    </Routes>
  ) : (
    <Routes>
      <Route key="home" path="/" element={<Home />} />
      <Route key="market-news" path="/market-news" element={<MarketNews />} />
      <Route key="portfolio" path="/portfolio" element={<Stocks />} />
      {/* <Route key="profile" path="/profile" element={<Profile />} /> */}
      <Route key="signup" path="/signup" element={<Signup />} />
      <Route key="login" path="/login" element={<Login />} />
      <Route
        key="portfolio_brief"
        path="/portfolio/:id"
        element={<PortfolioBrief />}
      />
      <Route
        key="stock_summary"
        path="/stock/summary/:symbol"
        element={<StockSummary />}
      />
      <Route
        key="stock_news"
        path="/stock/news/:symbol"
        element={<StockNews />}
      />
      <Route
        key="stock_historical_data"
        path="/stock/historicaldata/:symbol"
        element={<HistoricalData />}
      />
      <Route key="agent" path="/agent" element={<Agent />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
};

function App() {
  return (
    <Router>
      <AuthenticationHandler />
    </Router>
  );
}



export default App;

