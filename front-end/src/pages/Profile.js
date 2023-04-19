import React from "react";
import RightSide from '../components/RigtSide/RightSide';
import Sidebar from '../components/Sidebar/Sidebar';
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import '../assets/css/profile.css';
import img1 from '../assets/imgs/img4.jpg';
import { Facebook, Github, Instagram, Linkedin, PencilSquare, Twitter, Youtube } from "react-bootstrap-icons";
import Cards from "../components/Cards/Cards";

function Profile() {
    return (
        <div className="Home">
            <div className="HomeGlass">
                <Sidebar />
                <Container className="profileContainer">
                    <h1>Profile</h1>
                    <Row>
                        <Col xs={12} md={8} className="profileRow1">
                            <Image className="profileImage" src={img1} />
                            <div>
                                <h2>Chaitanya Pawar</h2>
                                <p>@chaitanyap22</p>
                            </div>
                        </Col>
                        <Col xs={6} md={4} className="profileRow2">
                            <button className="authButton btn-semi-transparent">Edit Profile <PencilSquare size="18px" /></button>
                        </Col>
                    </Row>
                    <Row>
                        <div className="profileDiv">
                            <h3>About</h3>
                            <p>lorem fiygy viWYRG iybydsv gFUSG O*vgStse7 o7garvehjabrjhdfzufbuevb ueagueatgbvuteafetau uteaf utfav tf eatuv uteaf utvf </p>
                            <h3>Info</h3>
                            <h5>Email : <span>abx@iygy.com</span></h5>
                            <h3>Social:</h3>
                            <Button className="box"><Facebook className="facebook"/></Button>
                            <Button className="box"><Twitter className="twitter"/></Button>
                            <Button className="box"><Instagram className="instagram"/></Button>
                            <Button className="box"><Youtube className="youtube"/></Button>
                            <Button className="box"><Linkedin className="linkedin"/></Button>
                            <Button className="box"><Github className="github"/></Button>
                    </div>
                </Row>
                <Row>
                    <Cards />
                </Row>
            </Container>
            <RightSide />
        </div>
        </div >
    );
}

export default Profile;