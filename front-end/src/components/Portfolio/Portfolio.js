import './Portfolio.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Table } from 'react-bootstrap';
import axios from 'axios'
import { Search } from 'react-bootstrap-icons'
import PortfolioModal from './PortfolioModal';
import protobuf from 'protobufjs';
const { Buffer } = require('buffer/');




export default function Portfolio() {

    //This state is used to store the value of the input search
    const [stockName, setStockName] = useState('');

    //Storing all the searched results in an Object
    const [bestResults, setBestResults] = useState({});

    //State used to determine whether to show modal or not
    const [modalShow, setModalShow] = useState(false);

    //State used for displaying conditional message below the search bar
    const [searchStatus, setSearchStatus] = useState(false);

    //State used to pass the symbol & stockName in the Modal Component
    const [modalStock, setModalStock] = useState({});

    //This state is used to save all the stocks that user has subscribed
    const [allStocks, setAllStocks] = useState([]);


    //This useEffect is used to get the live data
    useEffect(() => {


        const ws = new WebSocket('wss://streamer.finance.yahoo.com');
        protobuf.load('./YPricingData.proto', (error, root) => {

            if (error) {

                return console.log(error);
            }

            const Yaticker = root.lookupType("yaticker");

            ws.onopen = function open() {
                console.log('connected');

                // Database logic to get the list of symbols . Use hashset to store the symbols and then convert hashset to array
                const symbols = ['AAPL', 'TSLA', 'NVDA', 'GOOGL', 'AMZN', 'SNOW', 'COKE']

                ws.send(JSON.stringify({
                    subscribe: symbols
                }));

            };

            ws.onclose = function close() {
                console.log('disconnected');
            };

            ws.onmessage = function incoming(message) {
                console.log('coming message');

                let data = Yaticker.decode(new Buffer(message.data, 'base64'));
                console.log(data);
            };
        });

    })

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

            const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
            const { data } = await axios.get(url);
            const { bestMatches } = data;
            console.log(bestMatches);
            setBestResults(bestMatches);
        }
        catch (e) {
            console.log("Error occured");
            console.log(e);
        }
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

        setModalStock(e.target.textContent)
        setModalShow(true);
    }

    //Event Triggered when user press escape button or when user hits close button in the modal
    function hideModal(e) {

        setModalShow(false);
    }

    const stocks = [
        { name: "Portfolio 1", change: 1.92, symbol: 2, gain: -34399.06 },
        { name: "Portfolio 2", change: -1.92, symbol: 1, gain: 34399.06 },
    ];

    //Styling for Percent Change
    const makeStyle = (change) => {
        if (change > 0) {
            return {
                background: 'rgb(145 254 159 / 47%)',
                color: 'green',
            }
        }
        else if (change < 0) {
            return {
                background: '#ffadad8f',
                color: 'red',
            }
        }
        else {
            return {
                background: '#59bfff',
                color: 'white',
            }
        }
    }

    return (
        <>

            <div className='PortfolioDash'>
                <Container>
                    <h1>Portfolio</h1>
                    <div class="wrapper">
                        <div class="searchBar">
                            <input id="searchInput" type="text" name="searchInput" placeholder="Search for Stock" value={stockName} onChange={handleStockChange} />
                            <button id="searchSubmit" type="submit" name="searchSubmit" onClick={handleClick}>
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
                        ) : (searchStatus && !bestResults) || (searchStatus && bestResults.length === 0) ?
                            <p className='mt-3 label text-center'>No stock of that symbol found. Please try again</p> :
                            <p className='mt-3 label text-center'>Search to add the stock in your portfolio</p>}
                    </div>
                    <Row>
                        <Col xs={{ span: 11 }} md={{ span: 6, offset: 3 }} className="mt-5">
                            <PortfolioModal
                                name={modalStock}
                                show={modalShow}
                                onHide={hideModal}
                            />
                        </Col>
                    </Row>

                    <h3 className="mt-3">
                        MY PORTFOLIOS
                    </h3>
                    <Table>
                        <thead>
                            <tr>
                                <th>Portfolio Name</th>
                                <th>Change (in %)</th>
                                <th>No. of Symbols</th>
                                <th>Total Gain</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => (
                                <tr key={stock.symbol}>
                                    <td style={{ padding: "15px" }}>{stock.name}</td>
                                    <td style={{ padding: "15px" }}>
                                        <span className="change" style={makeStyle(stock.change)}>{stock.change}%</span>
                                    </td>
                                    <td style={{ padding: "15px" }}>{stock.symbol}</td>
                                    <td style={{ padding: "15px" }}>
                                        <span className="change" style={makeStyle(stock.gain)}>${stock.gain.toLocaleString("en-US")}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className='mt-3 container'>
                        <div className='d-flex justify-content-between'>
                            <h3>Total Market Value</h3>
                            <h5>$16,146.00</h5>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <h3>Day Gain</h3>
                            <h5>-319.00(-1.92%)</h5>
                        </div>

                        <div className='d-flex justify-content-between'>
                            <h3>Total Gain</h3>
                            <h5>+4150.00(+33.54%)</h5>
                        </div>
                    </div>
                </Container >
            </div>


        </>
    )
}