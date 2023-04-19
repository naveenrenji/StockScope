import React, { useState } from "react";
import RightSide from '../components/RigtSide/RightSide';
import Sidebar from '../components/Sidebar/Sidebar';
import { Button, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import '../assets/css/profile.css';
import img4 from '../assets/imgs/img4.png';
import { Facebook, Github, Instagram, Linkedin, PencilSquare, Twitter, Youtube } from "react-bootstrap-icons";
import Cards from "../components/Cards/Cards";

function Profile() {
    const [modal, setModal] = useState(false);
    const [avatar, setAvatar] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [about, setAbout] = useState("");

    const handleChange = (event) => {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (e) => {
            let img = e.target.result;
            setAvatar(img);
        };
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // update data here using state variables
        console.log(name, username, email, password, about);
      };
    
      const handleNameChange = (event) => {
        setName(event.target.value);
      };
    
      const handleUsernameChange = (event) => {
        setUsername(event.target.value);
      };
    
      const handleEmailChange = (event) => {
        setEmail(event.target.value);
      };
    
      const handlePasswordChange = (event) => {
        setPassword(event.target.value);
      };
    
      const handleAboutChange = (event) => {
        setAbout(event.target.value);
      };

    return (
        <div className="Home">
            <div className="HomeGlass">
                <Sidebar />
                <Container className="profileContainer">
                    <h1>Profile</h1>
                    <Row>
                        <Col xs={12} md={8} className="profileRow1">
                            {avatar ? <Image className="profileImage" src={avatar} /> : <Image className="profileImage" src={img4} />}
                            <div>
                                <h2>{name? name : "StockScope App"}</h2>
                                <p>{username ? "@"+username : "@stockscope12"}</p>
                            </div>
                        </Col>
                        <Col xs={6} md={4} className="profileRow2">
                            <button className="authButton btn-semi-transparent" onClick={() => setModal(true)}>Edit Profile <PencilSquare size="18px" /></button>
                        </Col>
                    </Row>
                    <Row>
                        <div className="profileDiv">
                            <h3>About</h3>
                            <p>{about ? about : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}</p>
                            <h3>Info</h3>
                            <h5>Email : <span>{email? email : "support@stockscope.app"}</span></h5>
                            <h3>Social:</h3>
                            <Button className="box"><Facebook className="facebook" /></Button>
                            <Button className="box"><Twitter className="twitter" /></Button>
                            <Button className="box"><Instagram className="instagram" /></Button>
                            <Button className="box"><Youtube className="youtube" /></Button>
                            <Button className="box"><Linkedin className="linkedin" /></Button>
                            <Button className="box"><Github className="github" /></Button>
                        </div>
                    </Row>
                    <Row>
                        <Cards />
                    </Row>
                </Container>
                <RightSide />

                <Modal
                    show={modal}
                    onHide={() => setModal(false)}
                    dialogClassName="edit-profile-modal"
                    backdrop="static"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Edit Profile
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="file" id="avatar" name="avatar" style={{ display: "none" }} onChange={handleChange} />
                        {avatar ? <Image className="profileImage" src={avatar} /> : <Image className="profileImage" src={img4} />}
                        <button type="button" onClick={() => document.getElementById("avatar").click()} className="authButton btn-semi-transparent">
                            Upload Image
                        </button>
                        <h4> Info</h4>
                        <Form onSubmit={handleFormSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter ypur name" value={name} onChange={handleNameChange} />
                                        <Form.Text className="text-muted">
                                            Change your name
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Choose username" value={username} onChange={handleUsernameChange}/>
                                        <Form.Text className="text-muted">
                                            Choose different username
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col><Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={handleEmailChange}/>
                                    <Form.Text className="text-muted">
                                        We'll never share your email.
                                    </Form.Text>
                                </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" value={password} onChange={handlePasswordChange}/>
                                        <Form.Text className="text-muted">
                                            Choose another password
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="formBasicAbout">
                                <Form.Label>About</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="About you" value={about} onChange={handleAboutChange}/>
                                <Form.Text className="text-muted">
                                    Describe about you
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </div >
    );
}

export default Profile;