import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';


export default function StockNews(props) {

    const [stockNews, setStockNews] = useState({});

    useEffect(() => {

        try {

            fetch(`http://localhost:3001/stock/news/${props.symbol}`, {
                "headers": {
                    "Content-Type": "application/json"
                },
                "method": "GET"
            }).then(response => response.json()).
                then(data => {

                    setStockNews(data);
                })
        }
        catch (error) {

            console.log(error);
        }
    }, [])

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
                            <Nav.Link href="/stock/statistics">Historical Data</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar >

            <Container className="mt-4">

                <h1>{`All the news relaed to ${props.name}`}  </h1>
            </Container>

        </>
    )
}