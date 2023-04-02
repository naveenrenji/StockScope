import React from "react";
import "./Cards.css";
import { cardsData } from "../../config/config";
import Card from "../Card/Card";

const Cards = () => {
  return (
    <>
      <h3>Your Stocks</h3>
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