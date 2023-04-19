import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios'
import PortfolioModal from './PortfolioModal';
import './Portfolio.css';


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
        <div className='PortfolioDash'>
            <Container>
                <h1>Portfolio</h1>
                <div class="wrapper">
                    <div class="searchBar">
                        <input id="searchInput" type="text" name="searchInput" placeholder="Search for Stock" value={stockName} onChange={handleStockChange} />
                        <button id="searchSubmit" type="submit" name="searchSubmit" onClick={handleClick}>
                            <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24"><path fill="#FF919D" d="M9.5,3A6.5,6.5
                             0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,
                             20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,
                             1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                            </svg>
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
                                    return <ListGroup.Item key={symbol} action onClick={showModal} className="liststyleItem">{symbol} - {name} </ListGroup.Item>
                                }
                            }
                            )}
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
                    MY PORTFOLIOS
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
        </div>
    )
}