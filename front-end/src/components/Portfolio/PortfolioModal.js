import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Button, Modal, InputGroup, FormControl, FormLabel, Dropdown } from 'react-bootstrap';
import { temp } from './portfolio-data';
import { checkNumberOfShares, checkBuyingPrice } from '../../helpers';

//This component is invoked when user searches for a stock and select it
export default function PortfolioModal(props) {

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

        //Ceck if the user has selected the portfolio or not
        if (portfolioValue === 'Select Portfolio')
            alert("Please select portfolio from the drop-down");

        else if (checkNumberOfShares(modalData.shares) && checkBuyingPrice(modalData.price)) {

            //Logic to update the data for a particular user in the database

            //Get the symbol and name 
            let stockSymbol = props.name.slice(0, props.name.indexOf('-'));
            stockSymbol = stockSymbol.trim();
            let stockName = props.name.slice(props.name.indexOf('-') + 1);
            stockName = stockName.trim();

            //Iterate over all the portfolios to get the index of the portfolio
            for (let i = 0; i < temp.Portfolios.length; i++) {

                if (temp.Portfolios[i].name === portfolioValue) {

                    let alreadyExist = false;
                    //Check if the stock is already present in the lot or not. If yes we will add it in the lots array which is already created
                    for (let j = 0; j < temp.Portfolios[i].stocks.length && !alreadyExist; j++) {

                        if (temp.Portfolios[i].stocks[j].symbol === stockSymbol) {

                            let lotData = {
                                shares: modalData.shares,
                                price: modalData.price
                            }

                            temp.Portfolios[i].stocks[j].lots.push(lotData);
                            alreadyExist = true;
                        }
                    }

                    //Stock is not present. Create the strucutrue of the stock and add the lot in the database
                    if (!alreadyExist) {

                        let stockObject = {
                            symbol: stockSymbol,
                            name: stockName,
                            lots: []
                        }

                        let lotData = {
                            shares: modalData.shares,
                            price: modalData.price
                        }

                        temp.Portfolios[i].stocks.push(stockObject);
                        temp.Portfolios[i].stocks[0].lots.push(lotData);
                    }

                    //Data is successfully added in the database and we are getting out of the loop
                    break;
                }
            }

            alert("Stock added successfully");
            props.onHide();
        }
    }

    return (
        <Modal
            {...props}
            size="xs"
            centered
        >
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

                        {temp.Portfolios.map((data) => {
                            return (

                                <Dropdown.Item eventKey={data.name} key={data.name}>{data.name}</Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>


                </Dropdown>


                <h4 className="mt-3">Name: {props.name}</h4>


                <Row>
                    <Col>
                        <InputGroup className="mt-3">
                            <FormLabel className="mt-3">Number of Shares:</FormLabel>
                            <FormControl
                                name="shares"
                                placeholder="Shares"
                                value={modalData.shares}
                                onChange={handleModalData}
                            />
                        </InputGroup>

                    </Col>

                    <Col>
                        <InputGroup className="mt-3">
                            <FormLabel className="mt-3">Avg Buying Price: </FormLabel>
                            <FormControl
                                name="price"
                                placeholder="Price"
                                value={modalData.price}
                                onChange={handleModalData}
                            />
                        </InputGroup>
                    </Col>
                </Row>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit} >Submit</Button>
                <Button onClick={props.onHide}>Close</Button>

            </Modal.Footer>
        </Modal>
    );
}