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

  function getSymbols(portfolios) {
    if (!portfolios) return [];

    let stocks = portfolios.stocks;
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

              let symbols = getSymbols(portfolioData);
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

  useEffect(() => {
    async function fetchData() {
      try {

        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay();

        if (
          (Object.keys(portfolioData).length > 0 && currentHour >= 16 ||
            currentHour <= 9 ||
            currentDay === 0 && currentDay === 6)
        ) {
          // Database logic to get the list of symbols . Use hashset to store the symbols and then convert hashset to array
          let porfolios = portfolioData

          console.log("Printing portfolio list");

          console.log(porfolios);

          let symbols = getSymbols(porfolios);

          console.log("Printing symbol");
          console.log(symbols);


          for (let i = 0; i < symbols.length; i++) {
            let { data } = await axios.get(
              `http://localhost:3001/chart/${symbols[i]}`
            );
            let symbol = symbols[i];

            setsymbolPrice((prevData) => {
              let temp = { ...prevData, [symbol]: data["c"] };
              return temp;
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);



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
  function calculateChangePercent(symbol, avg_price) {
    if (!dataFound || !symbol) return 0;

    let changePercent = 0;
    if (symbol in symbolPrice)
      changePercent = (symbolPrice[symbol] - avg_price) / avg_price;

    changePercent = (changePercent * 100).toFixed(2);
    return changePercent;
  }

  //Get the total change
  function calculateChange(symbol, avg_price, number_of_shares) {
    if (!dataFound || !symbol) return 0;


    let change = 0;

    if (symbol in symbolPrice)
      change = number_of_shares * (symbolPrice[symbol] - avg_price);
    change = parseFloat(change).toFixed(2);
    return change;
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
                  <td style={{ padding: "15px" }}>{symbolPrice[stock.symbol]}</td>
                  <td style={{ padding: "15px" }}>{calculateChange(stock.symbol, stock.avg_buy_price, stock.no_of_shares)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>

    </>
  );
}
