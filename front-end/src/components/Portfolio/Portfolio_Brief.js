import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, ListGroup, Button, Modal, InputGroup, FormControl, FormLabel, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios'
import { Search } from 'react-bootstrap-icons'


export default function Portfoio_Brief() {

    return (
        <>
            <Container>
                <div className="d-flex justify-content-between">

                    <DropdownButton
                        title="Dropdown right"
                        id="dropdown-menu-align-right"

                    >
                        <Dropdown.Item eventKey="option-1.1">option-1</Dropdown.Item>
                        <Dropdown.Item eventKey="option-2">option-2</Dropdown.Item>
                        <Dropdown.Item eventKey="option-3">option 3</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="some link">some link</Dropdown.Item>
                    </DropdownButton>

                </div>
            </Container>

        </>
    )
}