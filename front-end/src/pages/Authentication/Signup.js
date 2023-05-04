import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { doCreateUserWithEmailAndPassword } from "../../firebase/FirebaseFunctions";
import { AuthContext } from "../../firebase/Auth";
import SocialSignIn from "./SocialSignIn";
import { checkName, checkPassword, checkEmail } from "../../helpers";

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
            <Button variant="primary" type="submit">
              Signup
            </Button>

          </Form>
          <br></br>
          <SocialSignIn />
          <div>
            <Link to="/login">Login with existing/created account</Link>
          </div>{" "}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Signup;
