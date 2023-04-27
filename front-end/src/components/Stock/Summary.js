import protoFile from '../../config/YPricingData.proto';
import { React, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import protobuf from 'protobufjs';
const { Buffer } = require('buffer/');


export default function Summary(props) {

    //This useEffect is used to get the live data


    const [stockPrice, setStockPrice] = useState({});
    const [stockDetails, setStockDetails] = useState({});

    useEffect(() => {

        const ws = new WebSocket('wss://streamer.finance.yahoo.com');
        protobuf.load(protoFile, (error, root) => {

            if (error) {

                return console.log(error);
            }

            const Yaticker = root.lookupType("yaticker");

            ws.onopen = function open() {
                console.log('connected');

                // Database logic to get the list of symbols . Use hashset to store the symbols and then convert hashset to array
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
                setStockPrice(data);
                console.log(data);
            };
        });

    })

    useEffect(() => {


    })

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
                <h2>{parseFloat(stockPrice.price).toFixed(2)}</h2>
                <p>
                    <span style={
                        {
                            color: stockPrice.change > 0 ? 'green' : 'red'
                        }
                    }>
                        {parseFloat(stockPrice.change).toFixed(2)}
                    </span>

                    <span style={
                        {
                            color: stockPrice.changePercent > 0 ? 'green' : 'red',
                            paddingLeft: '0.8rem'
                        }
                    }>
                        ({parseFloat(stockPrice.changePercent).toFixed(2)})%
                    </span>
                </p>



            </Container>
        </>
    )
}