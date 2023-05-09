import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import SocialSignIn from "./SocialSignIn";
import "../../assets/css/authentication.css";
import { PersonCircle } from "react-bootstrap-icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfiguration";
import { Col, Row } from "react-bootstrap";
import env from "../../config/env.json";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (event, setterFunction) => {
    setterFunction(event.target.value);
  };

  const validateName = () => {
    if (!name) throw "You must provide a name";
    if (typeof name !== "string") throw "Name must be a string";
    if (name.trim().length === 0)
      throw "Name cannot be an empty string or string with just spaces";
    let nameTrim = name.trim();
    let a = nameTrim.split(" ");
    if (a.length != 2) throw "Name must have first and last name only";
    a.forEach((element) => {
      if (!/^[a-zA-Z]+$/.test(element))
        throw "Name must contain only alphabets";
      if (element.length < 3) throw "Name must have atleast 3 letters";
    });
    return nameTrim;
  };

  const validateEmail = () => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = () => {
    // Password validation regex pattern
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const onSignup = async (e) => {
    e.preventDefault();
    if (!validateEmail()) {
      alert("Please enter a valid Email");
      return;
    }
    if (!validatePassword()) {
      alert(
        "Please enter a password with at least 8 characters, containing at least one lowercase letter, one uppercase letter, and one number."
      );
      return;
    }
    try {
      validateName(name);
    } catch (e) {
      alert(e);
      return;
    }
    /* await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/login")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }); */

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);

      const userObj = {
        name: name,
        email: user.email,
      };

      const res = await axios.post(env.backend + "users/createuser", userObj);
      console.log(res.data);
      navigate("/login");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };
  return (
    <div className="authentication-body">
      <div className="authentication-container">
        <div className="authentication-container-wrapper">
          <h1 className="authentication-login-text">
            <PersonCircle /> Signup
          </h1>
          <Form>
            {/* <Form.Group controlId="formBasicUsername">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter EmailID"
                value={email}
                onChange={(event) => handleInputChange(event, setEmail)}
              />
              <Form.Text className="text-danger">
                {errorMessages.username}
              </Form.Text>
            </Form.Group> */}
            <Row>
              <Col>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) => handleInputChange(event, setName)}
                  />
                  <Form.Text className="text-danger">
                    {errorMessages.email}
                  </Form.Text>
                </Form.Group>
              </Col>
              {/* <Col>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="username"
                    placeholder="Choose username"
                    value={username}
                    onChange={(event) => handleInputChange(event, setUsername)}
                  />
                  <Form.Text className="text-danger">
                    {errorMessages.email}
                  </Form.Text>
                </Form.Group>
              </Col> */}
            </Row>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email ID</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(event) => handleInputChange(event, setEmail)}
              />
              <Form.Text className="text-danger">
                {errorMessages.email}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => handleInputChange(event, setPassword)}
              />
              <Form.Text className="text-danger">
                {errorMessages.password}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) =>
                  handleInputChange(event, setConfirmPassword)
                }
              />
              <Form.Text className="text-danger">
                {errorMessages.confirmPassword}
              </Form.Text>
            </Form.Group>
            <br></br>
            <button className="authButton" onClick={onSignup}>
              Signup
            </button>
          </Form>
          <h4>
            <span>Social Signup</span>
          </h4>
          <div className="authentication-social-media">
            <SocialSignIn />
          </div>
          <span className="authentication-ac">
            Already have an Account? <Link to="/login">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
