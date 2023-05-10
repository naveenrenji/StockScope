import "./Portfolio.css";
import { Link } from "react-router-dom";
import protoFile from "../../config/YPricingData.proto";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Table } from "react-bootstrap";
import NotFound from "../../pages/404";
import axios from "axios";
import { Search } from "react-bootstrap-icons";
import PortfolioModal from "./PortfolioModal";
import CreatePortfolioModal from "./CreatePortfolioModal";
import protobuf from "protobufjs";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfiguration";
import { useNavigate } from "react-router-dom";
const { Buffer } = require("buffer/");

export default function Portfolio() {
    //This state is used to store the value of the input search
    const [stockName, setStockName] = useState("");

    //Storing all the searched results in an Object
    const [bestResults, setBestResults] = useState({});

    //State used to determine whether to show modal or not
    const [modalShow, setModalShow] = useState(false);

    //State used for displaying conditional message below the search bar
    const [searchStatus, setSearchStatus] = useState(false);

    //State used to pass the symbol & stockName in the Modal Component
    const [modalStock, setModalStock] = useState({});

    //Get all the details of the user. This includes all the details such as stock names, portfolios etc.
    const [userInfo, setUserInfo] = useState({});

    //This state is used to check if we found the data or not
    const [userdataFound, setUserDataFound] = useState(false);

    //This state is used to store the recent prices of the symbols of the portfolio user has
    const [symbolPrice, setsymbolPrice] = useState({});

    //Set user email id for our use
    const [userEmailId, setuserEmailId] = useState("");

    //Usestate created to check whether to show create portfolio modal or not
    const [portfoliomodalShow, setportfolioModalShow] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                // ...
                console.log("uid", uid);
                console.log("email address", user.email);
                setuserEmailId(user.email);
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

    //Get the Info of the user
    useEffect(() => {
        async function fetchData() {
            try {
                console.log("Printing user data");

                setUserDataFound(false);
                let { data } = await axios.get(
                    `http://localhost:3001/users/getUserPortfolios/${userEmailId}`
                );
                setUserInfo(data);
                setUserDataFound(true);
            } catch (error) {
                console.log(error);
                setUserDataFound(false);
            }
        }
        fetchData();
    }, [modalShow, userEmailId]);

    useEffect(() => {
        async function fetchData() {
            try {
                setUserDataFound(false);

                const now = new Date();
                const currentHour = now.getHours();
                const currentDay = now.getDay();

                if (
                    (Object.keys(userInfo).length > 0 && currentHour >= 16 ||
                        currentHour <= 9 ||
                        currentDay === 0 && currentDay === 6)
                ) {
                    // Database logic to get the list of symbols . Use hashset to store the symbols and then convert hashset to array
                    let porfolios = userInfo["portfolios"];

                    console.log("Printing portfolio list");

                    console.log(porfolios);

                    let symbols = getSymbols(porfolios);

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
                setUserDataFound(false);
            }
        }
        fetchData();
    }, []);

    //This useEffect is used to get the live data
    useEffect(() => {
        async function fetchData() {
            try {
                const now = new Date();
                const currentHour = now.getHours();
                const currentDay = now.getDay();

                if (
                    Object.keys(userInfo).length > 0 &&
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

                            // Database logic to get the list of symbols . Use hashset to store the symbols and then convert hashset to array
                            let porfolios = userInfo["portfolios"];

                            console.log("Printing portfolio list");

                            console.log(porfolios);

                            let symbols = getSymbols(porfolios);
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

    //Function to make the value of the input search and the useState value consistent
    function handleStockChange(e) {
        console.log("handlechange triggered");
        setSearchStatus(false);
        setStockName(e.target.value);
        setBestResults({});
    }

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

    //function to get all the symbols of the portfolios

    function getSymbols(portfolios) {
        if (!portfolios) return [];

        let data = new Set();
        for (let i = 0; i < portfolios.length; i++) {
            let stocks = portfolios[i].stocks;
            for (let j = 0; j < stocks.length; j++) {
                let temp = stocks[j].symbol;
                data.add(temp);
            }
        }

        let symbolArray = [...data];
        return symbolArray;
    }

    //Event Triggered when user hits the search button
    function handleClick(e) {
        e.preventDefault();
        console.log("Button is pressed");
        setSearchStatus(true);
        searchStock(e);
    }

    //Event Triggered when user Clicks one of the list item in the search bar
    function showModal(e) {
        setModalStock(e.target.textContent);
        setModalShow(true);
    }

    //Event Triggered when user press escape button or when user hits close button in the modal
    function hideModal(e) {
        setModalShow(false);
    }

    //Event triggerred when user hits create portfolio buttton

    function showCreatePortfolioModal(e) {
        setportfolioModalShow(true);
    }

    function hideCreatePortfolioModal(e) {
        setportfolioModalShow(false);
    }

    //Styling for Percent Change
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

    //Get the total number of symbols in the portfolio
    function noOfSymbols(portfolio) {
        if (!portfolio) return 0;

        return portfolio.stocks.length;
    }

    //Get the total change Percent
    function calculateChangePercent(portfolio) {
        if (!userdataFound || !portfolio) return 0;

        let stocks = portfolio.stocks;

        let changePercent = 0;

        console.log("Printing symbol price")
        console.log(symbolPrice);

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
        if (!userdataFound || !portfolio) return 0;

        let stocks = portfolio.stocks;

        let change = 0;

        console.log("Printing symbol price")
        console.log(symbolPrice);

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
        if (!userdataFound || !portfolios) return 0;

        let marketValue = 0;

        console.log("Printing symbol price")
        console.log(symbolPrice);
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
        if (!userdataFound || !portfolios) return 0;

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

    function deletePortfolio(portfolioId) {
        if (portfolioId && userEmailId.length > 0) {
            try {
                let body = {
                    email: userEmailId,
                    portfolioId: portfolioId,
                };

                let data = axios
                    .post("http://localhost:3001/users/deletePortfolio", body)
                    .then(function (response) {
                        console.log(response);
                        alert("Portfolio deleted successfully");
                        window.location.reload();
                    })
                    .catch(function (error) {
                        console.log(error);
                        alert("Issue occured. Please try again");
                    });
            } catch (error) {
                alert("Issue occured. Please try again");
            }
        }
    }

    if (Object.keys(userInfo).length > 0) {
        return (
            <>
                <div className="PortfolioDash">
                    <Container>
                        <h1>Portfolio</h1>
                        <div className="wrapper">
                            <div className="searchBar">
                                <form
                                    onSubmit={handleClick} // handle form submission
                                    className="searchBar"
                                >
                                    <input
                                        id="searchInput"
                                        type="text"
                                        name="searchInput"
                                        placeholder="Search for Stock"
                                        value={stockName}
                                        onChange={handleStockChange}
                                        aria-label="Search for Stocks"
                                    />
                                    <button
                                        id="searchSubmit"
                                        type="submit"
                                        name="searchSubmit"
                                        aria-label="Search button"
                                    >
                                        <Search color="#FF919D" />
                                    </button>
                                </form>
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
                                                    onClick={showModal}
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
                                    Search to add the stock in your portfolio
                                </p>
                            )}
                        </div>
                        <Row>
                            <Col
                                xs={{ span: 11 }}
                                md={{ span: 6, offset: 3 }}
                                className="mt-5"
                            >
                                <PortfolioModal
                                    name={modalStock}
                                    show={modalShow}
                                    onHide={hideModal}
                                    portfolioName={userInfo.portfolios}
                                    email={userInfo.email}
                                />
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-between">
                            <h2 className="mt-3">My Portfolios</h2>

                            <button className="authButton" onClick={showCreatePortfolioModal}>
                                Create Portfolio
                            </button>

                            <CreatePortfolioModal
                                show={portfoliomodalShow}
                                onHide={hideCreatePortfolioModal}
                                email={userInfo.email}
                            />
                        </div>

                        <Table>
                            <thead>
                                <tr>
                                    <th>Portfolio Name</th>
                                    <th>Change (in %)</th>
                                    <th>No. of Symbols</th>
                                    <th>Total Gain</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userInfo.portfolios.map((portfolio) => (
                                    <tr key={portfolio._id}>
                                        <td style={{ padding: "15px" }}>
                                            <Link to={`/portfolio/${portfolio._id}`}>
                                                {portfolio.name}
                                            </Link>
                                        </td>
                                        <td style={{ padding: "15px" }}>
                                            <span
                                                className="change"
                                                style={makeStyle(calculateChangePercent(portfolio))}
                                            >
                                                {calculateChangePercent(portfolio)}%
                                            </span>
                                        </td>
                                        <td style={{ padding: "15px" }}>
                                            {noOfSymbols(portfolio)}
                                        </td>
                                        <td style={{ padding: "15px" }}>
                                            <span
                                                className="change"
                                                style={makeStyle(calculateChange(portfolio))}
                                            >
                                                ${calculateChange(portfolio).toLocaleString("en-US")}
                                            </span>
                                        </td>
                                        <td style={{ padding: "15px" }}>
                                            {portfolio.name !== "default" && (
                                                <button
                                                    onClick={() => deletePortfolio(portfolio._id)}
                                                    className="authButton"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <div className="mt-3 container">
                            <div className="d-flex justify-content-between">
                                <h3>Total Market Value</h3>
                                <h4>${calculateTotalMarketValue(userInfo.portfolios)}</h4>
                            </div>

                            <div className="d-flex justify-content-between">
                                <h3>Total Gain</h3>
                                <h4>${calculateTotalGain(userInfo.portfolios)}</h4>
                            </div>
                        </div>
                    </Container>
                </div>
            </>
        );
    }
}
