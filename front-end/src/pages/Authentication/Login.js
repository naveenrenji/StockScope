import React, { useState } from "react";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../../firebase/FirebaseFunctions";
import SocialSignIn from "./SocialSignIn";
import '../../assets/css/authentication.css'
import { PersonCircle } from "react-bootstrap-icons";

export let isLoggedIn = false;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)
    ) {
      setError(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number."
      );
    } else {
      // Add code to submit the login form
      try {
        await doSignInWithEmailAndPassword(email.value, password.value);
        isLoggedIn = true; // set isLoggedIn to true upon successful login
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
            <PersonCircle /> Login
          </h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={handleUsernameChange}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <span className="authentication-ac">
            <Link to="">Forgot Password?</Link>
          </span>
            <br></br>
            <button type="submit" className="authButton">
              Login
            </button>
          </Form>
          {error && <p className="text-danger">{error}</p>}
          <h4>
            <span>Social Login</span>
          </h4>
          <div className="authentication-social-media">
            <SocialSignIn />
          </div>
          <span className="authentication-ac">
            Don't have an Account? <Link to="/signup">Signup</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
