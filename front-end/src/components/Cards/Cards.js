import React from "react";
import "./Cards.css";
import Card from "../Card/Card";
import { cardsData as defaultCard } from "../../config/config";
import { useState, useEffect } from "react";
import axios from "axios";

const Cards = () => {
  //const [stocksData, setStocksData] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const parsePrices = (prices) => {
    let floatPrices = [];
    for (const price of prices) {
      floatPrices.push(Number.parseFloat(price).toFixed(2));
    }

    return floatPrices;
  };

  const buildCards = (stocksData) => {
    let cards = defaultCard;
    if (stocksData && stocksData.length > 0) {
      cards = [
        {
          title: stocksData[0].name,
          symbol: stocksData[0].symbol,
          color: {
            backGround: "linear-gradient(180deg, #6667ff 0%, #8141f3 100%)",
            boxShadow: "0px 10px 20px 0px #e0c6f5",
          },
          barValue: stocksData[0].change.toFixed(2),
          value: stocksData[0].price,
          series: [
            {
              name: stocksData[0].symbol,
              data: parsePrices(stocksData[0].histData.prices),
            },
          ],
        },
        {
          title: stocksData[1].name,
          symbol: stocksData[1].symbol,
          color: {
            backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
            boxShadow: "0px 10px 20px 0px #FDC0C7",
          },
          barValue: stocksData[1].change.toFixed(2),
          value: stocksData[1].price,
          series: [
            {
              name: stocksData[1].symbol,
              data: parsePrices(stocksData[1].histData.prices),
            },
          ],
        },
        {
          title: stocksData[2].name,
          symbol: stocksData[2].symbol,
          color: {
            backGround:
              "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
            boxShadow: "0px 10px 20px 0px #F9D59B",
          },
          barValue: stocksData[2].change.toFixed(2),
          value: stocksData[2].price,
          series: [
            {
              name: stocksData[2].symbol,
              data: parsePrices(stocksData[2].histData.prices),
            },
          ],
        },
      ];
    }

    return cards;
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCount((prevCount) => prevCount + 1);
    }, 60000); // 60 seconds

    async function fetchData() {
      try {
        let { data } = await axios.get(
          "http://localhost:3001/screener/top-gainers"
        );
        console.log(data);
        //setStocksData(data);
        //console.log(stocksData);
        setCardsData(buildCards(data));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    fetchData();

    return () => {
      clearInterval(interval);
    };
  }, [renderCount]);

  if (loading) {
    return (
      <div className="Table">
        <h3>Loading....</h3>
      </div>
    );
  } else {
    return (
      <>
        <h2>Top Gainers</h2>
        <div className="Cards">
          {cardsData &&
            cardsData.map((card, id) => (
              <div className="parentContainer" key={id}>
                <Card {...card} />
              </div>
            ))}
        </div>
      </>
    );
  }
};
export default Cards;
