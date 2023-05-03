import { React, useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { Table } from 'react-bootstrap';

export default function HistoricalData(props) {


    const [activeTab, setActiveTab] = useState('income-statement');
    const [data, setData] = useState([]);
    const [showAnnual, setShowAnnual] = useState(true);
    const [dataFound, setDataFound] = useState(false);


    let tableData = [];


    useEffect(() => {

        async function fetchData() {

            try {

                setDataFound(false);
                let { data } = await axios.get(`http://localhost:3001/stock/income-statement/${props.symbol}`);
                if (showAnnual) {

                    let temp = data.annualReports;
                    setData(temp);
                }

                else {

                    let temp = data.quarterlyReports;
                    let new_temp = temp.slice(0, 5);
                    setData(new_temp);
                }

                setDataFound(true);
            }

            catch (error) {

                console.log(error);
                setDataFound(false);
            }
        }

        fetchData();
    }, [showAnnual, activeTab])


    if (dataFound && data.length > 0) {


        console.log(data[0]);

        let ObjectKeys = Object.keys(data[0]);


        for (let i = 0; i < ObjectKeys.length; i++) {

            tableData.push(`<tr> <td> ${ObjectKeys[i]} </td> </tr>`);
        }

        return (
            <>

                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">StockScope</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/stock/summary">Summary</Nav.Link>
                                <Nav.Link href="/stock/news">News</Nav.Link>
                                <Nav.Link href="/stock/historicaldata">Historical Data</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar >


                <Container className="mt-4">
                    <h1>{props.name}</h1>
                    <p>NasdaqGS - NasdaqGS Real Time Price. Currency in USD</p>
                    <Nav variant="pills" activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
                        <Nav.Item>
                            <Nav.Link eventKey="income-statement">Income Statement</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="balance-sheet">Balance Sheet</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="cash-flow">Cash Flow</Nav.Link>
                        </Nav.Item>
                    </Nav>


                    {tableData &&
                        <Table>
                            <tbody>
                                {tableData}
                            </tbody>

                        </Table>
                    }



                </Container>
            </>
        )
    }

    else {

        <Container>
            <h1>Data not Found</h1>
        </Container>
    }
}