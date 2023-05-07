import "bootstrap/dist/css/bootstrap.min.css";
import noImage from '../../assets/imgs/no-image.png';
import { React, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { ListGroup, Row } from "react-bootstrap";
import axios from 'axios';
import RightSide from "../RigtSide/RightSide";
import StockScopeNavbar from "../StockScopeNavbar/StockScopeNavbar";
import Sidebar from "../Sidebar/Sidebar";
import './Stocks.css';


const StockNews = (props) => {
    //This useEffect is used to get the live data
    const [stockNews, setStockNews] = useState([]);

    //This useEffect is used to get the live data for news of the company
    useEffect(() => {
        async function fetchData() {
            try {
                let { data } = await axios.get(`http://localhost:3001/stock/news/${props.symbol}`);

                setStockNews(prevData => {
                    let temp = [...data];
                    return temp;
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    return (
        <div className='Home'>
            <div className='HomeGlass'>
                <Sidebar />
                <div className='summaryContainer'>
                    <StockScopeNavbar />
                    <Container className="mt-4">
                        <h1>{`News about ${props.name}`}  </h1>
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
                                        <Card.Img src={data.image.length > 0 ? data.image : noImage} aria-label="News-Image"/>
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
                <RightSide />
            </div>
        </div>
    );
};

export default StockNews;