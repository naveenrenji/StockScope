import React from "react";
import CustomerReview from "../CustomerReview/CustomerReview";
import Updates from "../Updates/Updates";
import "./RightSide.css";
import ChatBot from "../ChatBot/ChatBot";

const RightSide = () => {
  return (
    <div className="RightSide">
      <div>
        <h2>Recent News</h2>
        <Updates />
      </div>
      <div>
        <h3>Your Stocks Graph</h3>
        <CustomerReview />
      </div>
      <ChatBot />
    </div>
  );
};

export default RightSide;
