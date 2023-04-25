import React, { useState } from "react";
import "./MarketNews.css";
import { Container, ListGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

const MarketNewsComponent = () => {
    //This state is used to store the value of the input search
    const [newsName, setNewsName] = useState('');

    //Storing all the searched results in an Object
    const [bestResults, setBestResults] = useState({});

    //State used to determine whether to show modal or not
    /* const [modalShow, setModalShow] = useState(false); */

    //State used for displaying conditional message below the search bar
    const [searchStatus, setSearchStatus] = useState(false);

    //Function to make the value of the input search and the useState value consistent
    function handleNewsChange(e) {
        console.log("handlechange triggered");
        setSearchStatus(false);
        setNewsName(e.target.value);
        setBestResults({});
    }

    return (
        <div className="MarketNewsDash">
            <Container>
                <h1>Market News</h1>
                <div class="wrapper">
                    <div class="searchBar">
                        <input id="searchInput" type="text" name="searchInput" placeholder="Search for News" value={newsName} onChange={handleNewsChange} />
                        <button id="searchSubmit" type="submit" name="searchSubmit" onClick="" disabled>
                            <Search color='#FF919D' />
                        </button>
                    </div>
                    {bestResults && bestResults.length > 0 ? (
                        <ListGroup className="mt-3 liststyle">
                            
                        </ListGroup>
                    ) : (searchStatus && !bestResults) || (searchStatus && bestResults.length === 0) ?
                        <p className='mt-3 label text-center'>No news found. Please try again</p> :
                        <p className='mt-3 label text-center'>Search for news to add it in your portfolio</p>}
                </div>
            </Container>
        </div>
    );
};

export default MarketNewsComponent;
