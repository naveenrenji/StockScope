import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

import { registerWithEmailAndPassword } from "../../firebase/FirebaseFunctions";
import { AuthContext } from "../../firebase/Auth";
import { doCreateUserWithEmailAndPassword } from "../../firebase/FirebaseFunctions";
/* import { AuthContext } from "../../firebase/Auth"; */
import SocialSignIn from "./SocialSignIn";
import { checkName, checkPassword, checkEmail } from "../../helpers";
import '../../assets/css/authentication.css';
import { PersonCircle } from "react-bootstrap-icons";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (event, setterFunction) => {
    setterFunction(event.target.value);
  };

  const validateInputs = () => {
    const newErrorMessages = {};

    try {
      checkName(username);
    } catch (error) {
      newErrorMessages.username = error.message;
    }

    try {
      checkEmail(email);
    } catch (error) {
      newErrorMessages.email = error.message;
    }

    try {
      checkPassword(password);
    } catch (error) {
      newErrorMessages.password = error.message;
    }

    if (password !== confirmPassword) {
      newErrorMessages.confirmPassword = "Passwords do not match";
    }

    setErrorMessages(newErrorMessages);

    return Object.keys(newErrorMessages).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset errors
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate inputs
    if (!username) {
      setUsernameError("Username cannot be empty");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setUsernameError("Username can only contain alphanumeric characters");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one digit");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    // Add code to submit the signup form
    try {
      await registerWithEmailAndPassword(email, password, username);
    } catch (error) {
      alert(error);
    if (validateInputs()) {
      try {
        await doCreateUserWithEmailAndPassword(email, password, username);
        navigate("/login");
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <div className="authentication-body">
      <div className="authentication-container">
        <div className="authentication-container-wrapper">
          <h3 className="authentication-login-text">
            <PersonCircle /> Signup
          </h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(event) => handleInputChange(event, setUsername)}
              />
              <Form.Text className="text-danger">
                {errorMessages.username}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
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
            <button type="submit" className="authButton btn-semi-transparent">
              Signup
            </button>

          </Form>
          <h4>
            <span>Social Signup</span>
          </h4>
          <div className="authentication-social-media">
            <SocialSignIn />
            <a href="#">
              <div className="icons8-facebook-circled authentication-social-mediaImg"></div>
            </a>
            <a href="#">
              <div className="icons8-twitter authentication-social-mediaImg"></div>
            </a>
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
