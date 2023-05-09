import { React, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { Navbar, Nav, Table } from "react-bootstrap";
import Sidebar from "../Sidebar/Sidebar";
import StockScopeNavbar from "../StockScopeNavbar/StockScopeNavbar";
import NotFound from '../../pages/404';
import RightSide from "../RigtSide/RightSide";
import "./Stocks.css";
import ChatBot from "../ChatBot/ChatBot";
import { useParams } from 'react-router-dom';

const HistoricalData = () => {
  //This useEffect is used to get the live data
  const [activeTab, setActiveTab] = useState("income-statement");
  const [data, setData] = useState({});
  const [showAnnual, setShowAnnual] = useState("annual-records");
  const [dataFound, setDataFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const { symbol } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setDataFound(false);
        let { data } = await axios.get(
          `http://localhost:3001/stock/${activeTab}/${symbol}`
        );
        console.log(data);
        if (showAnnual === "annual-records") {
          let temp = data.annualReports;
          setData(temp);
        } else {
          let temp = data.quarterlyReports;
          setData(temp);
        }
        setDataFound(true);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setDataFound(false);
      }
    }
    fetchData();
  }, [showAnnual, activeTab, showAnnual]);

  if (loading) {
    return <div>Loading...</div>;
  } else {

    if (dataFound) {
      return (
        <div className="Home">
          <div className="stocksGlass">
            <Sidebar />
            <div className="summaryContainer">
              <Navbar bg="light" expand="lg">
                <Container>
                  <Navbar.Brand href="/">StockScope</Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                      <Nav.Link href={`/stock/summary/${symbol}`}>Summary</Nav.Link>
                      <Nav.Link href={`/stock/news/${symbol}`}>News</Nav.Link>
                      <Nav.Link href={`/stock/historicaldata/${symbol}`}>Historical Data</Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar >
              <Container className="mt-4">
                <h1>{symbol}</h1>
                <p>NasdaqGS - NasdaqGS Real Time Price. Currency in USD</p>
                <Nav
                  variant="pills"
                  activeKey={activeTab}
                  onSelect={(tab) => setActiveTab(tab)}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="income-statement">
                      Income Statement
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="balance-sheet">Balance Sheet</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="cash-flow">Cash Flow</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Nav
                  variant="pills"
                  activeKey={showAnnual}
                  onSelect={(tab) => setShowAnnual(tab)}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="annual-records">Annual Records</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="quarterly-records">
                      Quarterly Records
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {Object.keys(data) && Object.keys(data).length > 0 && (
                  <Table>
                    <tbody>
                      {Object.entries(data).map(([key, value]) => {
                        return (
                          <tr key={key}>
                            <td>{key}</td>
                            {value &&
                              value.map((data, index) => {
                                return <td key={index}>{data}</td>;
                              })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Container>
            </div>
            <ChatBot />
          </div>
        </div>
      );
    } else {
      return (<NotFound />)
    }
  }
};

export default HistoricalData;
