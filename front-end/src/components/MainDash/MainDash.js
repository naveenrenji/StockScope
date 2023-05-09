import React, { memo, useState } from "react";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import { Search } from 'react-bootstrap-icons'
import axios from "axios";
import "./MainDash.css";
import { Container, ListGroup } from "react-bootstrap";


const MainDash = () => {
  const [stockName, setStockName] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);
  const [bestResults, setBestResults] = useState({});


  //Axios call to search the stock when the user enters the stock name and hits enter or search button
  async function searchStock(e) {
    try {
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`;
      const { data } = await axios.get(url);
      const { bestMatches } = data;
      console.log(bestMatches);
      setBestResults(bestMatches);
    } catch (e) {
      console.log("Error occured");
      console.log(e);
    }
  }

  //Function to make the value of the input search and the useState value consistent
  function handleStockChange(e) {
    console.log("handlechange triggered");
    setSearchStatus(false);
    setStockName(e.target.value);
    setBestResults({});
  }

  function handleClick(e) {
    e.preventDefault();
    console.log("Button is pressed");
    setSearchStatus(true);
    searchStock(e);
  }



  return (
    <div className="MainDash">
      <Container>
      <h1>Dashboard</h1>
      <div className="wrapper">
        <div className="searchBar">
          <input id="searchInput" type="text" name="searchInput" placeholder="Search for Stock" value={stockName} onChange={handleStockChange} aria-label="Search for Stocks" />
          <button id="searchSubmit" type="submit" name="searchSubmit" onClick={handleClick} aria-label='Search button'>
            <Search color='#FF919D' />
          </button>
        </div>
        {bestResults && bestResults.length > 0 ? (
                <ListGroup className="mt-3 liststyle">
                  {bestResults.map((item) => {
                    let type = item["3. type"];
                    let region = item["4. region"];

                    if (type === "Equity" && region === "United States") {
                      let symbol = item["1. symbol"];
                      let name = item["2. name"];
                      return (
                        <ListGroup.Item
                        key={symbol}
                        action
                        onClick={() => window.location.href = `http://localhost:3000/stock/summary/${symbol}`}
                        className="liststyleItem"
                        >
                          {symbol} - {name}
                        </ListGroup.Item> 
                      );
                    } else {
                      return null;
                    }
                  })}
                </ListGroup>
              ) : (searchStatus && !bestResults) ||
                (searchStatus && bestResults.length === 0) ? (
                <p className="mt-3 label text-center">
                  No stock of that symbol found. Please try again
                </p>
              ) : (
                <p className="mt-3 label text-center">
                  Search a stock
                </p>
              )}
        </div>
        <Cards />
        <Table />
        </Container>
      </div>
      );
};

      export default memo(MainDash);