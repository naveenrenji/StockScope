import React, { useState } from "react";
import RightSide from '../components/RigtSide/RightSide';
import Sidebar from '../components/Sidebar/Sidebar';
import { Alert, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import '../assets/css/profile.css';
import img4 from '../assets/imgs/img4.png';
import { PencilSquare } from "react-bootstrap-icons";
import Cards from "../components/Cards/Cards";
import { auth } from "../firebase/FirebaseFunctions";

function Profile() {
    const [modal, setModal] = useState(false);
    const [avatar, setAvatar] = useState(auth.currentUser.photoURL);
    const { currentUser, updateProfile } = /* useAuth(); */ useState(auth.currentUser);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        about: '',
    });

    const [newFormData, setNewFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        about: "",
    });

    const profileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
        }
    }
    console.log(currentUser);
    const isGoogleUser = currentUser.providerId; 

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            //await updateProfile(newFormData, avatar);
            setFormData(newFormData, avatar)
            setModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        
        <div className="Home">
            <div className="HomeGlass">
                <Sidebar />
                <Container className="profileContainer">
                    <h1>Profile</h1>
                    <Row>
                        <Col className="profileRow1">
                            {isGoogleUser ? (
                                <>
                                    <Image className="profileImage" src={currentUser.photoURL} />
                                    <div>
                                        <h2>{currentUser.displayName}</h2>
                                        <p>@{currentUser.displayName.replace(/\s/g, "").toLowerCase()}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {avatar ? (
                                        <Image className="profileImage" src={avatar} />
                                    ) : (
                                        <Image className="profileImage" src={img4} />
                                    )}
                                    <div>
                                        <h2>{formData.name ? formData.name : "StockScope App"}</h2>
                                        <p>
                                            {formData.username
                                                ? "@" + formData.username
                                                : "@stockscope12"}
                                        </p>
                                    </div>
                                </>
                            )}
                        </Col>
                        <Col className="profileRow2">
                            <button className="authButton" onClick={() => setModal(true)}>Edit Profile <PencilSquare size="18px" /></button>
                        </Col>
                    </Row>
                    <Row>
                        <div className="profileDiv">
                            <h3>About</h3>
                            <p>{formData.about ? formData.about : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."}</p>
                            <h3>Info</h3>
                            <h5>Email : <span>{formData.email ? formData.email : "support@stockscope.app"}</span></h5>
                        </div>
                    </Row>
                    <Row>
                        <Cards />
                    </Row>
                </Container>
                <RightSide />

                <Modal show={modal} onHide={() => setModal(false)} aria-labelledby="modal-styling-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="modal-styling-title">Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {isGoogleUser ? <Alert className="profile-alert">You have used Google Sign In so only about info can be edited!</Alert> : ""}
                        <input type="file" id="avatar" name="avatar" style={{ display: "none" }} onChange={profileImageChange} disabled={isGoogleUser} />
                        {avatar ? <Image className="profileImage" src={avatar} /> : <Image className="profileImage" src={img4} />}
                        <button type="button" onClick={() => document.getElementById("avatar").click()} className="authButton">
                            Upload Image
                        </button>
                        <h4> Info</h4>
                        <Form onSubmit={handleFormSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter your name" name="name" value={newFormData.name} onChange={handleChange} disabled={isGoogleUser} />
                                        <Form.Text className="text-muted">Change your name</Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Choose username" name="username" value={newFormData.username} onChange={handleChange} disabled={isGoogleUser} />
                                        <Form.Text className="text-muted">Choose a different username</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {!isGoogleUser && (
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email" name="email" value={newFormData.email} onChange={handleChange} />
                                            <Form.Text className="text-muted">We'll never share your email.</Form.Text>
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" name="password" value={newFormData.password} onChange={handleChange} />
                                            <Form.Text className="text-muted">Leave blank to keep the same password.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            <Form.Group className="mb-3" controlId="formBasicAbout">
                                <Form.Label>About</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Tell us about yourself" name="about" value={newFormData.about} onChange={handleChange} />
                            </Form.Group>

                            <button variant="primary" type="submit" className="authButton">
                                Save Changes
                            </button>
                        </Form>
                    </Modal.Body>
                </Modal>

            </div>
        </div >
    );
}

export default Profile;