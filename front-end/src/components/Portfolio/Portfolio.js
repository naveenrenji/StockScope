import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, ListGroup, Button, Modal, InputGroup, FormControl, FormLabel, Dropdown, DropdownButton } from 'react-bootstrap';
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

    return (
        <>
            <Container>

                <Row>
                    <Col xs={{ span: 11 }} md={{ span: 6, offset: 3 }} className="mt-5">
                        <Form onSubmit={handleClick}>
                            <Form.Group controlId="formSearch">
                                <Form.Control
                                    type="text"
                                    placeholder="Search for Stock"
                                    onChange={handleStockChange}
                                    value={stockName}
                                />
                            </Form.Group>

                        </Form>

                        {bestResults && bestResults.length > 0 ? (
                            <ListGroup className="mt-3">
                                {bestResults.map((item) => {

                                    let type = item["3. type"];
                                    let region = item["4. region"];


                                    if (type === "Equity" && region === "United States") {

                                        let symbol = item["1. symbol"];
                                        let name = item["2. name"];
                                        return <ListGroup.Item key={symbol} action onClick={showModal} >{symbol} - {name} </ListGroup.Item>
                                    }
                                }
                                )}
                            </ListGroup>
                        ) : (searchStatus && !bestResults) || (searchStatus && bestResults.length === 0) ? <p className='mt-3'>No stock of that symbol found. Please try again</p> : <p className='mt-3'>Search to add the stock in your portfolio</p>}

                        <PortfolioModal
                            name={modalStock}
                            show={modalShow}
                            onHide={hideModal}
                        />
                    </Col>
                    <Col xs={{ span: 1 }} md={{ span: 1 }} className="mt-5">
                        <Button variant="secondary" onClick={handleClick}>
                            <Search />
                        </Button>
                    </Col>
                </Row>

                <div className='mt-3'>
                    <h2>Total Market Value</h2>
                    <h2>$16,146.00</h2>
                    <div className='d-flex justify-content-between'>
                        <h3>Day Gain</h3>
                        <h3>-319.00(-1.92%)</h3>
                    </div>

                    <div className='d-flex justify-content-between'>
                        <h3>Total Gain</h3>
                        <h3>+4150.00(+33.54%)</h3>
                    </div>
                </div>

                <h2 className="mt-3">
                    My Portfolios
                </h2>
                <div className='mt-3'>
                    <div className='d-flex justify-content-between'>
                        <h3>Portfolio  1</h3>
                        <h3>(-1.92%)</h3>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <h3>2 Symbols</h3>
                        <h3>+$34,399.06</h3>
                    </div>
                    <hr />

                    <div className='d-flex justify-content-between'>
                        <h3>Portfolio 2</h3>
                        <h3>(-1.92%)</h3>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <h3>1 Symbol</h3>
                        <h3>+$34,399.06</h3>
                    </div>
                    <hr />
                </div>

            </Container >
        </>
    )
}