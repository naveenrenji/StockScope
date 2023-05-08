import React, { useState } from 'react';
import { Row, Col, Modal, Dropdown, Form } from 'react-bootstrap';
import { checkNumberOfShares, checkBuyingPrice } from '../../helpers';
import axios from 'axios'

//This component is invoked when user searches for a stock and select it
export default function PortfolioModal(props) {

    console.log("Inside portfolio modal");

    let portfolios = props.portfolioName;

    //State used to set the value from the portfolio dropdown
    const [portfolioValue, setPortfolioValue] = useState('Select Portfolio');

    //This state is used to populate the number of shares and price from the modal
    const [modalData, setmodalData] = useState({
        shares: "",
        price: ""
    });

    //Function to change the value of the dropdown
    const handleSelect = (e) => {
        console.log(e);
        setPortfolioValue(e);
    }

    //Function to populate the data in the modalData state
    const handleModalData = (e) => {

        setmodalData(prevData => {
            return {
                ...prevData,
                [e.target.name]: e.target.value
            }
        })
    }


    //When the user hits submit button this function is invoked
    const handleSubmit = (e) => {

        try {

            //Check if the user has selected the portfolio or not
            if (portfolioValue === 'Select Portfolio')
                alert("Please select portfolio from the drop-down");

            else if (checkNumberOfShares(modalData.shares) && checkBuyingPrice(modalData.price)) {

                //Logic to update the data for a particular user in the database

                //Get the symbol and name 
                let stockSymbol = props.name.slice(0, props.name.indexOf('-'));
                stockSymbol = stockSymbol.trim();
                let stockName = props.name.slice(props.name.indexOf('-') + 1);
                stockName = stockName.trim();

                let dataBody = {

                    "email": props.email,
                    "portfolioName": portfolioValue,
                    "symbol": stockSymbol,
                    "stockName": stockName,
                    "shares": modalData.shares,
                    "price": modalData.price
                }

                console.log(dataBody);

                let temp = axios.post("http://localhost:3001/users/addstocktoportfolio", dataBody).then(function (response) {
                    console.log(response);
                    alert("Stock added successfully");
                    props.onHide();
                }).catch(function (error) {

                    console.log(error);
                });
            }
        }

        catch (error) {

            console.log(error);
            alert(error.message);
        }
    }

    return (
        <Modal {...props} size="xs" centered >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add a Stock
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        {portfolioValue}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {portfolios.map((data) => {
                            return (
                                <Dropdown.Item eventKey={data.name} key={data._id}>{data.name}</Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>

                <h4 className="mt-3">Name: {props.name}</h4>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>No. of Shares: </Form.Label>
                            <Form.Control type="text" name="shares" placeholder="Shares" value={modalData.shares} onChange={handleModalData} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Avg Buying Price: </Form.Label>
                            <Form.Control type="text" name="price"
                                placeholder="Price"
                                value={modalData.price}
                                onChange={handleModalData} />
                        </Form.Group>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <button className='authButton' onClick={handleSubmit}>Submit</button>
                <button className='authButton' onClick={props.onHide}>Cancel</button>
            </Modal.Footer>
        </Modal>
    );
}