import protoFile from '../../config/YPricingData.proto';
import { React, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Table } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import protobuf from 'protobufjs';
import axios from 'axios';
import Chart from '../StockChart/Chart';
const { Buffer } = require('buffer/');




export default function Summary(props) {

    //This useEffect is used to get the live data
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const [latestStockInfo, setLatestStockInfo] = useState();
    const [stockPrice, setStockPrice] = useState(0);
    const [changePrice, setChangePrice] = useState(0);
    const [changePercentange, setChangePercentange] = useState(0);
    const [stockDetails, setStockDetails] = useState({});

    //This useEffect is used to get the live data price of the stock
    useEffect(() => {

        const ws = new WebSocket('wss://streamer.finance.yahoo.com');
        protobuf.load(protoFile, (error, root) => {
            if (error) {

                return console.log(error);
            }

            const Yaticker = root.lookupType("yaticker");
            ws.onopen = function open() {
                console.log('connected');

                let symbol = [];
                symbol.push(props.symbol);
                ws.send(JSON.stringify({
                    subscribe: symbol
                }));
            };

            ws.onclose = function close() {
                console.log('disconnected');
            };

            ws.onmessage = function incoming(message) {
                console.log('coming message');

                let data = Yaticker.decode(new Buffer(message.data, 'base64'));
                console.log(data);
                setLatestStockInfo(data);
                if (currentHour >= 9 && currentHour <= 16 && currentDay !== 0 && currentDay !== 6) {

                    //Set the price of the stock and the change percentage from the websocket;
                    setStockPrice(data.price);
                    setChangePrice(data.change)
                    setChangePercentange(data.changePercent);
                }
            };
        });
    }, [])

    //This useEffect is used to get the fundamental details of the stock
    useEffect(() => {

        async function fetchData() {
            try {

                let { data } = await axios.get(`http://localhost:3001/stock/${props.symbol}`);
                console.log(data);
                setStockDetails(data);

                if (currentHour >= 16 || currentHour < 9 || currentDay === 0 || currentDay === 6) {

                    setStockPrice(data["Current Price"]);
                    setChangePrice(data["Change"])
                    setChangePercentange(data["Percent Change"]);

                }
            }

            catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">StockScope</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/stock/summary">Summary</Nav.Link>
                            <Nav.Link href="/stock/news">News</Nav.Link>
                            <Nav.Link href="/stock/statistics">Historical Data</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>

                <h1> {props.symbol} - {props.name}.</h1>
                <Chart symbol={props.symbol}></Chart>
                <br></br>
                <h3>NasdaqGS - NasdaqGS Real Time Price. Currency in USD</h3>
                <h2>{parseFloat(stockPrice).toFixed(2)}</h2>
                <p>
                    <span style={
                        {
                            color: changePrice > 0 ? 'green' : 'red'
                        }
                    }>
                        {parseFloat(changePrice).toFixed(2)}
                    </span>

                    <span style={
                        {
                            color: changePercentange > 0 ? 'green' : 'red',
                            paddingLeft: '0.8rem'
                        }
                    }>

                        {parseFloat(changePercentange.toFixed(2))}%
                    </span>
                </p>

                <Table>
                    <tbody>
                        {Object.keys(stockDetails).map((key, index) => {

                            let formattedNumber;
                            let number = stockDetails[key];

                            if (!isNaN(number)) {

                                number = parseFloat(number);
                                formattedNumber = number.toLocaleString(undefined, {
                                    maximumFractionDigits: 20,
                                });
                            }

                            else
                                formattedNumber = number;

                            return (
                                <tr key={index}>
                                    <td>
                                        {key}
                                    </td>
                                    <td>
                                        {formattedNumber}
                                    </td>
                                </tr>
                            );
                        }
                        )}
                    </tbody>
                </Table>

            </Container>
        </>
    )
}