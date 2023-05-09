import "bootstrap/dist/css/bootstrap.min.css";
import noImage from '../../assets/imgs/no-image.png';
import { React, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import NotFound from '../../pages/404';
import { ListGroup, Nav, Navbar, Row } from "react-bootstrap";
import axios from 'axios';
import RightSide from "../RigtSide/RightSide";
import StockScopeNavbar from "../StockScopeNavbar/StockScopeNavbar";
import Sidebar from "../Sidebar/Sidebar";
import './Stocks.css';
import Chatbot from "../ChatBot/ChatBot";
import { useParams } from 'react-router-dom';


const StockNews = () => {
    //This useEffect is used to get the live data
    const [stockNews, setStockNews] = useState([]);
    const [dataFound, setDataFound] = useState(false);
    const [loading, setLoading] = useState(true);

    const { symbol } = useParams();

    //This useEffect is used to get the live data for news of the company
    useEffect(() => {
        async function fetchData() {
            try {

                setDataFound(false);
                let { data } = await axios.get(`http://localhost:3001/stock/news/${symbol}`);

                setStockNews(prevData => {
                    let temp = [...data];
                    return temp;
                });

                setDataFound(true);
                setLoading(false);
            }
            catch (error) {
                console.log(error);
                setDataFound(false);
            }
        }
        fetchData();
    }, [])

    if (loading) {
        return (
            <div className='Table'>
                <h3>Loading....</h3>
            </div>
        );
    } else {

        if (dataFound) {

            return (
                <div className='Home'>
                    <div className='stocksGlass'>
                        <Sidebar />
                        <div className='summaryContainer'>
                            <Navbar bg="light" expand="lg">
                                <Container>
                                    <Navbar.Brand href="/">StockScope</Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto">
                                            <Nav.Link href={`/stock/summary/${symbol}`}>Summary</Nav.Link>
                                            <Nav.Link href={`/stock/news/${symbol}`}>News</Nav.Link>
                                            <Nav.Link href={`/stock/historicaldata/${symbol}`}>Historical Data</Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar >
                            <Container className="mt-4">
                                <h1>{`News about ${symbol}`}  </h1>
                                <Row xs={1} md={2}>
                                    {stockNews && stockNews.length > 0 && stockNews.map((data) => {

                                        let time;
                                        if (data.datetime > 0) {

                                            const date = new Date(0);
                                            date.setUTCSeconds(data.datetime);
                                            let am_pm = "AM";
                                            let hours = date.getHours();
                                            let mins = date.getMinutes();

                                            if (mins < 10) {
                                                mins = "0" + mins;
                                            }
                                            if (hours == 12) {
                                                am_pm = "PM";
                                            }
                                            else if (hours > 12) {
                                                am_pm = "PM";
                                                hours = hours - 12;
                                            }

                                            time = "Last Sync: " +
                                                + (date.getMonth() + 1) + "/"
                                                + date.getDate() + "/"
                                                + date.getFullYear() + " @ "
                                                + hours + ":"
                                                + mins + am_pm
                                        }

                                        return (
                                            <Card className="mt-4 mr-4"  >
                                                <Card.Img src={data.image.length > 0 ? data.image : noImage} aria-label="News-Image" />
                                                <Card.Body>
                                                    <Card.Title> <a href={data.url} target="_blank"> {data.headline.length > 0 ? data.headline : 'No headline'}</a></Card.Title>
                                                    <Card.Text>
                                                        {data.summary.length > 0 ? data.summary : 'No Summary'}
                                                    </Card.Text>
                                                </Card.Body>
                                                <ListGroup className="list-group-flush">
                                                    {data.source.length > 0 && <ListGroup.Item >Source: {data.source}</ListGroup.Item>}
                                                    <ListGroup.Item>{time}</ListGroup.Item>
                                                </ListGroup>
                                            </Card>
                                        )
                                    })}
                                </Row>
                            </Container >
                        </div>
                        <Chatbot />
                    </div>
                </div>
            );
        }

        else {
            return (<NotFound />)
        }
    }
};

export default StockNews;