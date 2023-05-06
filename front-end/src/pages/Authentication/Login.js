import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {
  logInWithEmailAndPassword,
  sendPasswordReset,
  auth
} from "../../firebase/FirebaseFunctions";
import SocialSignIn from "./SocialSignIn";
import SignUp from "./Signup";
import { useAuthState } from "react-firebase-hooks/auth";

import '../../assets/css/authentication.css'
import { PersonCircle } from "react-bootstrap-icons";

export let isLoggedIn = false;


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/");
  }, [user, loading, navigate]);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)
    ) {
      setErrorMessage(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number."
      );
    } else {
      // Add code to submit the login form
      try {
        await logInWithEmailAndPassword(email.value, password.value);
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
            <Form.Group controlId="email">
              <Form.Label>Email ID</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={handleEmail}
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
            {/* <a href="#">
              <div className="icons8-facebook-circled authentication-social-mediaImg"></div>
            </a>
            <a href="#">
              <div className="icons8-twitter authentication-social-mediaImg"></div>
            </a> */}
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
