import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import SocialSignIn from "./SocialSignIn";
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword } from 'firebase/auth';

import '../../assets/css/authentication.css'
import { PersonCircle } from "react-bootstrap-icons";
import { auth } from "../../firebase/firebaseConfiguration";

export let isLoggedIn = false;


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useState(""); //useAuthState(auth);
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

  // Login with email and password
  const onLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail()) {
      alert();
      return;
    }
    if (!validatePassword()) {
      alert(
        'Please enter a password with at least 8 characters, containing at least one lowercase letter, one uppercase letter, and one number.'
      );
      return;
    }
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        alert("There is no user with this email. Please sign up first.");
        return;
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate("/");
      console.log(user);
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
            <button className="authButton" onClick={onLogin}>
              Login
            </button>
          </Form>
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
