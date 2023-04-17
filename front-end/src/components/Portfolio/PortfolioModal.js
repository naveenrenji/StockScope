import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Button, Modal, InputGroup, FormControl, FormLabel, Dropdown } from 'react-bootstrap';
import { temp } from './portfolio-data';

//This component is invoked when user searches for a stock and select it
export default function PortfolioModal(props) {

    const [portfolioValue, setPortfolioValue] = useState('Select Portfolio');

    const handleSelect = (e) => {
        console.log(e);
        setPortfolioValue(e);
    }

    //When the user enters the number of shares and average price and hits submit button this function is invoked
    const handleSubmit = (e) => {
        console.log("Modal Submit button is pressed");
        props.onHide();

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
                                placeholder="Shares"
                            />
                        </InputGroup>

                    </Col>

                    <Col>
                        <InputGroup className="mt-3">
                            <FormLabel className="mt-3">Avg Buying Price: </FormLabel>
                            <FormControl
                                placeholder="Price"
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