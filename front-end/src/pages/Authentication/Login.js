import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  logInWithEmailAndPassword,
  sendPasswordReset,
  auth
} from "../../firebase/FirebaseFunctions";
import SocialSignIn from "./SocialSignIn";
import SignUp from "./Signup";
import { useAuthState } from "react-firebase-hooks/auth";


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
  }, [user, loading]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
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
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: "20rem" }}>
        <Card.Body>
          <Card.Title>Login</Card.Title>
          {error && <p className="text-danger">{error}</p>}
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
            <br></br>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
          <br></br>
          <SocialSignIn />
          <div>Create an account</div>
        </Card.Body>

      </Card>
    </div>
  );
}

export default Login;
