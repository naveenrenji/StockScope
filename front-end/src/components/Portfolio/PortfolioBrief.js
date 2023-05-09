import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfiguration";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

export default function PortfoioBrief() {
  console.log("Inside portfolio brief");

  console.log("Inside portfolio brief");

  const { id } = useParams();
  const [emailId, setEmailId] = useState("");
  const navigate = useNavigate();
  const [portfolioData, setPortFolioData] = useState({});
  const [loading, setLoading] = useState(true);

  const [dataFound, setdataFound] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setEmailId(user.email);
      } else {
        // User is signed out
        // ...
        console.log("user is logged out");
        alert("You are not Logged in");
        navigate("/");
      }
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      if (emailId.length > 0) {
        try {
          setdataFound(false);
          setLoading(true);
          let body = {
            email: emailId,
            portfolioId: id,
          };

          const { data } = await axios.post(
            "http://localhost:3001/users/getPortfolioById",
            body
          );
          setPortFolioData({ ...data });
          setLoading(false);
        } catch (error) {
          console.log(error);
          setdataFound(false);
        }
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return <h1>Loading .......................</h1>;
  }

  return (
    <>
      <h1>Portfolio Brief page is rendered</h1>
      {/* <Container>
                <div className="d-flex justify-content-between">

                    <DropdownButton
                        title="Dropdown right"
                        id="dropdown-menu-align-right" >
                        <Dropdown.Item eventKey="option-1.1">option-1</Dropdown.Item>
                        <Dropdown.Item eventKey="option-2">option-2</Dropdown.Item>
                        <Dropdown.Item eventKey="option-3">option 3</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="some link">some link</Dropdown.Item>
                    </DropdownButton>

                </div>
            </Container> */}
    </>
  );
}
