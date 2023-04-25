import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { doCreateUserWithEmailAndPassword } from "../../firebase/FirebaseFunctions";
import { AuthContext } from "../../firebase/Auth";
import SocialSignIn from "./SocialSignIn";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
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
      await doCreateUserWithEmailAndPassword(email, password, username);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: "20rem" }}>
        <Card.Body>
          <Card.Title>Signup</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={handleUsernameChange}
              />
              <Form.Text className="text-danger">{usernameError}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <Form.Text className="text-danger">{passwordError}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <Form.Text className="text-danger">
                {confirmPasswordError}
              </Form.Text>
            </Form.Group>
            <br></br>
            <Button variant="primary" type="submit">
              Signup
            </Button>
          </Form>
          <br></br>
          <SocialSignIn />
          <div>Create an account instead</div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Signup;
