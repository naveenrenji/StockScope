import React, { useState, useEffect } from 'react';
import NotFound from '../../pages/404';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebaseConfiguration';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import protobuf from "protobufjs";
import protoFile from "../../config/YPricingData.proto";

export default function PortfoioBrief() {
    console.log("Inside portfolio brief");

    console.log("Inside portfolio brief");

    const { id } = useParams();
    const [emailId, setEmailId] = useState();
    const navigate = useNavigate();
    const [portfolioData, setPortFolioData] = useState({});
    const [loading, setLoading] = useState(true);
    const [symbolPrice, setsymbolPrice] = useState({});

    const [dataFound, setdataFound] = useState(false);

    function getSymbols(stocks) {
        if (!stocks) return [];

        let data = new Set();

        for (let i = 0; i < stocks.length; i++) {
            let symbol = stocks[i].symbol;
            data.add(symbol);
        }

        let symbolArray = [...data];
        return symbolArray;
    }

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
                navigate('/');
            }
        });
        return unsubscribe;
    }, [navigate]);

    useEffect(() => {

        async function fetchData() {

            try {

                setdataFound(false);
                setLoading(true);
                let body = {
                    email: emailId,
                    portfolioId: id
                }

                const { data } = await axios.post("http://localhost:3001/users/getPortfolioById", body);
                console.log(data);
                setPortFolioData({ ...data });
                setLoading(false);
            }

            catch (error) {
                console.log(error);
                setdataFound(false);
                setLoading(false);
            }
        }
        fetchData();
    }, [emailId])

    useEffect(() => {
        async function fetchData() {
            try {

                const now = new Date();
                const currentHour = now.getHours();
                const currentDay = now.getDay();

                if (Object.keys(portfolioData).length > 0 &&
                    (currentHour >= 16) ||
                    currentHour <= 9 ||
                    (currentDay === 0 && currentDay === 6)
                ) {
                    // Database logic to get the list of symbols . Use hashset to store the symbols and then convert hashset to array

                    console.log("Printing portfolio list");

                    console.log(portfolioData);

                    let symbols = getSymbols(portfolioData.stocks);

                    for (let i = 0; i < symbols.length; i++) {
                        let { data } = await axios.get(
                            `http://localhost:3001/chart/${symbols[i]}`
                        );
                        let symbol = symbols[i];

                        setsymbolPrice((prevData) => {
                            let temp = { ...prevData, symbol: data["c"] };
                            return temp;
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    //This useEffect is used to get the live data
    useEffect(() => {
        async function fetchData() {
            try {
                const now = new Date();
                const currentHour = now.getHours();
                const currentDay = now.getDay();

                if (
                    Object.keys(portfolioData).length > 0 &&
                    currentHour >= 9 &&
                    currentHour <= 16 &&
                    currentDay !== 0 &&
                    currentDay !== 6
                ) {
                    const ws = new WebSocket("wss://streamer.finance.yahoo.com");
                    protobuf.load(protoFile, (error, root) => {
                        if (error) {
                            return console.log(error);
                        }

                        const Yaticker = root.lookupType("yaticker");

                        ws.onopen = function open() {
                            console.log("connected");

                            let symbols = getSymbols(portfolioData.stocks);
                            console.log(symbols);

                            ws.send(
                                JSON.stringify({
                                    subscribe: symbols,
                                })
                            );
                        };

                        ws.onclose = function close() {
                            console.log("disconnected");
                        };

                        ws.onmessage = function incoming(message) {
                            console.log("coming message");

                            let data = Yaticker.decode(new Buffer(message.data, "base64"));
                            setsymbolPrice((prevData) => {
                                let temp = {
                                    ...prevData,
                                    [data.id]: parseFloat([data.price]).toFixed(2),
                                };
                                return temp;
                            });
                            console.log(data);
                        };
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    });

    function calculateTotalMarketValue(p) {
        if (Object.keys(portfolioData).length === 0 || !dataFound) return 0;

        let marketValue = 0;

        let stocks = portfolioData.stocks;

        for (let i = 0; i < stocks.length; i++) {
            let symbol = stocks[i].symbol;

            if (symbol in symbolPrice)
                marketValue += stocks[i].no_of_shares * symbolPrice[symbol];

        }

        marketValue = parseFloat(marketValue).toFixed(2);
        return marketValue;
    }


    if (loading) {

        return (
            <h1>Loading .......................</h1>
        )
    }

    if (Object.keys(portfolioData).length === 0) {

        return (
            <NotFound />
        )
    }

    return (
        <>

            <h1>{portfolioData.name} </h1>
            <h3>{calculateTotalMarketValue()}</h3>

        </>
    )
}
