import React, { useState } from 'react';
import { Row, Col, Modal, Form } from 'react-bootstrap';
import axios from 'axios'

//This component is invoked when user searches for a stock and select it
export default function CreatePortfolioModal(props) {


    //This state is used to populate the number of shares and price from the modal
    const [portfolioName, setportFolioName] = useState('');

    console.log("Inside create portfolio modal");

    //When the user hits submit button this function is invoked
    const handleSubmit = (e) => {

        try {

            //Check if the user has selected the portfolio or not
            if (portfolioName.length === 0)
                alert("Please select portfolio from the drop-down");

            let dataBody = {
                "email": props.email,
                "portfolioName": portfolioName
            }


            let temp = axios.post("http://localhost:3001/users/createnewportfolio", dataBody).then(function (response) {
                console.log(response);
                alert("Stock added successfully");
                props.onHide();
            }).catch(function (error) {

                console.log(error);
            });

        }

        catch (error) {

            console.log(error);
            alert(error.error);
        }
    }

    const handleModalData = (e) => {

        setportFolioName(e.target.value);
    }

    return (
        <Modal {...props} size="xs" centered >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add a name to your portfolio
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter portfolioName </Form.Label>
                            <Form.Control type="text" name="portfolio-name" placeholder="Enter Portfolio Name" value={portfolioName} onChange={handleModalData} />
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