import { React, useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { ListGroup, Row } from "react-bootstrap";
import axios from 'axios';

export default function HistoricalData(props) {

    return (
        <>

            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">StockScope</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/stock/summary">Summary</Nav.Link>
                            <Nav.Link href="/stock/news">News</Nav.Link>
                            <Nav.Link href="/stock/historicaldata">Historical Data</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar >

            <Container className="mt-4">
                <h1>{props.name}</h1>
                <p>NasdaqGS - NasdaqGS Real Time Price. Currency in USD</p>
                <div style={{ backgroundColor: "#C0C0C0" }}>
                    <h1>Hellow roronoa</h1>

                </div>


            </Container>
        </>
    )
}