import React, { useState, useEffect } from "react";
import NotFound from "../../pages/404";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfiguration";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import protobuf from "protobufjs";
import protoFile from "../../config/YPricingData.proto";
import { Container, Row, Col, ListGroup, Table } from "react-bootstrap";

export default function PortfoioBrief() {
  console.log("Inside portfolio brief");

  console.log("Inside portfolio brief");

  const { id } = useParams();
  const [emailId, setEmailId] = useState();
  const navigate = useNavigate();
  const [portfolioData, setPortFolioData] = useState({});
  const [loading, setLoading] = useState(true);
  const [symbolPrice, setsymbolPrice] = useState({});

  const [dataFound, setdataFound] = useState(false);

  function getSymbols(stocks) {
    if (!stocks) return [];

    let data = new Set();

    for (let i = 0; i < stocks.length; i++) {
      let symbol = stocks[i].symbol;
      data.add(symbol);
    }

    let symbolArray = [...data];
    return symbolArray;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setEmailId(user.email);
      } else {
        // User is signed out
        // ...
        console.log("user is logged out");
        alert("You are not Logged in");
        navigate("/");
      }
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        setdataFound(false);
        setLoading(true);
        let body = {
          email: emailId,
          portfolioId: id,
        };

        const { data } = await axios.post(
          "http://localhost:3001/users/getPortfolioById",
          body
        );
        console.log(data);
        setPortFolioData({ ...data });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setdataFound(false);
        setLoading(false);
      }
    }
    fetchData();
  }, [emailId]);

  //This useEffect is used to get the live data
  useEffect(() => {
    async function fetchData() {
      try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay();

        if (
          Object.keys(portfolioData).length > 0 &&
          currentHour >= 9 &&
          currentHour <= 16 &&
          currentDay !== 0 &&
          currentDay !== 6
        ) {
          const ws = new WebSocket("wss://streamer.finance.yahoo.com");
          protobuf.load(protoFile, (error, root) => {
            if (error) {
              return console.log(error);
            }

            const Yaticker = root.lookupType("yaticker");

            ws.onopen = function open() {
              console.log("connected");

              let symbols = getSymbols(portfolioData.stocks);
              console.log(symbols);

              ws.send(
                JSON.stringify({
                  subscribe: symbols,
                })
              );
            };

            ws.onclose = function close() {
              console.log("disconnected");
            };

            ws.onmessage = function incoming(message) {
              console.log("coming message");

              let data = Yaticker.decode(new Buffer(message.data, "base64"));
              setsymbolPrice((prevData) => {
                let temp = {
                  ...prevData,
                  [data.id]: parseFloat([data.price]).toFixed(2),
                };
                return temp;
              });
              console.log(data);
            };
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  });

  const makeStyle = (change) => {
    if (change > 0) {
      return {
        background: "rgb(145 254 159 / 47%)",
        color: "green",
      };
    } else if (change < 0) {
      return {
        background: "#ffadad8f",
        color: "red",
      };
    } else {
      return {
        background: "#007eb3",
        color: "white",
      };
    }
  };

  function noOfSymbols(stocks) {
    if (!stocks) return 0;

    return stocks.length;
  }

  //Get the total change Percent
  function calculateChangePercent(stocks) {
    if (!dataFound || !stocks) return 0;

    let changePercent = 0;

    for (let i = 0; i < stocks.length; i++) {
      let symbol = stocks[i].symbol;
      let avg_price = stocks[i].avg_buy_price;
      if (symbol in symbolPrice)
        changePercent += (symbolPrice[symbol] - avg_price) / avg_price;
    }

    changePercent = (changePercent * 100).toFixed(2);
    return changePercent;
  }

  //Get the total change
  function calculateChange(portfolio) {
    if (!dataFound || !portfolio) return 0;

    let stocks = portfolio.stocks;

    let change = 0;

    for (let i = 0; i < stocks.length; i++) {
      let symbol = stocks[i].symbol;
      let avg_price = stocks[i].avg_buy_price;
      let number_of_shares = stocks[i].no_of_shares;
      if (symbol in symbolPrice)
        change += number_of_shares * (symbolPrice[symbol] - avg_price);
    }

    change = parseFloat(change).toFixed(2);
    return change;
  }

  function calculateTotalMarketValue(portfolios) {
    if (!dataFound || !portfolios) return 0;

    let marketValue = 0;
    for (let i = 0; i < portfolios.length; i++) {
      let stocks = portfolios[i].stocks;

      for (let j = 0; j < stocks.length; j++) {
        let symbol = stocks[j].symbol;

        if (symbol in symbolPrice)
          marketValue += stocks[j].no_of_shares * symbolPrice[symbol];
      }
    }

    marketValue = parseFloat(marketValue).toFixed(2);
    return marketValue;
  }

  function calculateTotalGain(portfolios) {
    if (!dataFound || !portfolios) return 0;

    let totalGain = 0;
    for (let i = 0; i < portfolios.length; i++) {
      let stocks = portfolios[i].stocks;

      for (let j = 0; j < stocks.length; j++) {
        let symbol = stocks[j].symbol;

        if (symbol in symbolPrice)
          totalGain +=
            stocks[j].no_of_shares *
            (symbolPrice[symbol] - stocks[j].avg_buy_price);
      }
    }

    totalGain = parseFloat(totalGain).toFixed(2);
    return totalGain;
  }

  function getSymbols(stocks) {
    if (!stocks) return [];

    let data = new Set();

    for (let j = 0; j < stocks.length; j++) {
      let temp = stocks[j].symbol;
      data.add(temp);
    }

    let symbolArray = [...data];
    return symbolArray;
  }

  function calculateTotalMarketValue(p) {
    if (Object.keys(portfolioData).length === 0 || !dataFound) return 0;

    let marketValue = 0;

    let stocks = portfolioData.stocks;

    for (let i = 0; i < stocks.length; i++) {
      let symbol = stocks[i].symbol;

      if (symbol in symbolPrice)
        marketValue += stocks[i].no_of_shares * symbolPrice[symbol];
    }

    marketValue = parseFloat(marketValue).toFixed(2);
    return marketValue;
  }

  if (loading) {
    return <h1>Loading .......................</h1>;
  }

  if (Object.keys(portfolioData).length === 0) {
    return <NotFound />;
  }

  return (
    <>
      <div className="PortfolioDash">
        <Container>
          <h1>{portfolioData.name}</h1>

          <Table>
            <thead>
              <tr>
                <th>Stock Name</th>
                <th>Stock Symbol</th>
                <th>No. of Stocks</th>
                <th>Avg buying price</th>
                <th>Current price</th>
                <th>Net Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.stocks.map((stock) => (
                <tr key={stock._id}>
                  <td style={{ padding: "15px" }}>{stock.name}</td>
                  <td style={{ padding: "15px" }}>{stock.symbol}</td>
                  <td style={{ padding: "15px" }}>{stock.no_of_shares}</td>
                  <td style={{ padding: "15px" }}>{stock.avg_buy_price}</td>
                  <td style={{ padding: "15px" }}>{stock.avg_buy_price}</td>
                  <td style={{ padding: "15px" }}>
                    <span
                      className="change"
                      style={makeStyle(calculateChangePercent(stock))}
                    >
                      {calculateChangePercent(stock)}%
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>{noOfSymbols(stock)}</td>
                  <td style={{ padding: "15px" }}>
                    <span
                      className="change"
                      style={makeStyle(calculateChange(stock))}
                    >
                      ${calculateChange(stock).toLocaleString("en-US")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="mt-3 container">
            <div className="d-flex justify-content-between">
              <h3>Total Market Value</h3>
              <h4>${calculateTotalMarketValue(portfolioData.stocks)}</h4>
            </div>

            <div className="d-flex justify-content-between">
              <h3>Total Gain</h3>
              <h4>${calculateTotalGain(portfolioData.stocks)}</h4>
            </div>
          </div>
        </Container>
      </div>
      <h3>{calculateTotalMarketValue()}</h3>
    </>
  );
}
