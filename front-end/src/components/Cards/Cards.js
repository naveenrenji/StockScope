import React from "react";
import "./Cards.css";
import { cardsData } from "../../config/config";
import Card from "../Card/Card";

const Cards = () => {
  return (
    <>
      <h2>Your Stocks</h2>
      <div className="Cards">
        {cardsData.map((card, id) => (
          <div className="parentContainer" key={id}>
            <Card {...card} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Cards;