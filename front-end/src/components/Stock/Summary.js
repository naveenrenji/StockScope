import protoFile from '../../config/YPricingData.proto';
import { React, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Tab, Table } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import protobuf from 'protobufjs';
const { Buffer } = require('buffer/');
const axios = require("axios");


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
                setLatestStockInfo(data);
                if (currentHour >= 9 && currentHour <= 20 && currentDay !== 0 && currentDay !== 6) {

                    //Set the price of the stock and the change percentage from the websocket;
                    setStockPrice(data.price);
                    setChangePrice(data.change)
                    setChangePercentange(data.changePercent);
                }
            };
        });
    })

    //This useEffect is used to get the fundamental details of the stock
    useEffect(() => {

        async function fetchData() {
            try {

                fetch(`http://localhost:3001/stock/${props.symbol}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "GET",
                }).then(response => response.json()
                ).then((data) => {

                    console.log(data);
                    setStockDetails(data);

                    if (currentHour >= 20 || currentHour < 9 || currentDay === 0 || currentDay === 6) {

                        setStockPrice(data["Current Price"]);
                        setChangePrice(data["Change"])
                        setChangePercentange(data["Percent Change"]);

                    }
                })

            } catch (e) {
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
                            <Nav.Link href="/stock/statistics">Statistics</Nav.Link>
                            <Nav.Link href="/stock/statistics">Historical Data</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>

                <h1> {props.symbol} - {props.name}.</h1>
                <p>NasdaqGS - NasdaqGS Real Time Price. Currency in USD</p>
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
                            return (
                                <tr key={index}>
                                    <td>
                                        {key}
                                    </td>
                                    <td>
                                        {stockDetails[key]}
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