import React, { useEffect, useState } from "react";
import "./MarketNews.css";
import { Container, ListGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import noImage from "../../assets/imgs/no-image.png";
import axios from "axios";

const MarketNewsComponent = () => {
    //This state is used to store the value of the input search
    const [newsName, setNewsName] = useState('');

    //Storing all the searched results in an Object
    const [bestResults, setBestResults] = useState({});
    const [loading, setLoading] = useState(true);

    //State used for displaying conditional message below the search bar
    const [searchStatus, setSearchStatus] = useState(false);

    useEffect(() => {
        //fetch Data from the back-end
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3001/screener/news/${newsName}`);
                setBestResults(data);
                setSearchStatus(true);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }

        fetchData();
    }, [newsName])

    //Function to make the value of the input search and the useState value consistent
    function handleNewsChange(e) {
        console.log("handlechange triggered");
        setNewsName(e.target.value);
    }

    if (loading) {
        return (
            <div className='MarketNewsDash'>
                <h3>Loading....</h3>
            </div>
        )
    } else {

        return (
            <div className="MarketNewsDash">
                <Container className="NewsContainer">
                    <h1>Market News</h1>
                    <div class="wrapper">
                        <div class="searchBar">
                            <input id="searchInput" type="text" name="searchInput" placeholder="Search for News" value={newsName} onChange={handleNewsChange} aria-label="Search for News" />
                            <button id="searchSubmit" type="submit" name="searchSubmit" onClick="" disabled>
                                <Search color='#FF919D' />
                            </button>
                        </div>
                        {bestResults && bestResults.length > 0 ? (
                            <ListGroup className="mt-3 liststyle">
                                {bestResults.map((result, index) => {
                                    return (
                                        <div className="update" key={index}>
                                            <img src={result.img ? result.img : noImage} alt="profile" />
                                            <div className="details">
                                                <div className="info">
                                                    <span><Link to={result.url} target="_blank">{result.title}</Link></span>
                                                    <p> {result.summary}</p>
                                                </div>
                                                <p>Published on:<span> {result.publishedTime}</span></p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </ListGroup>
                        ) :
                        (searchStatus && !bestResults) || (searchStatus && bestResults.length === 0) ?
                        <p className='mt-3 label text-center'>No news found. Please try again</p> :
                        <p className='mt-3 label text-center'>Search for news</p>}
                    </div>
                </Container>
            </div>
        );
    }
};

export default MarketNewsComponent;
