import React from "react";
import axios from "axios";
import "./Updates.css";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import noImage from "../../assets/imgs/no-image.png";


const Updates = () => {
  const [UpdatesData, setUpdatesData] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCount((prevCount) => prevCount + 1);
    }, 120000); // 120 seconds

    async function fetchData() {
      try {
        const { data } = await axios.get('http://localhost:3001/screener/general-news');
        setUpdatesData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      clearInterval(interval);
    };
  }, [renderCount]);

  if (loading) {
    return (
      <div className='Updates'>
        <h3>Loading....</h3>
      </div>
    )
  } else {
    return (
      <div className="Updates">
        {UpdatesData.slice(0, 10).map((update, index) => {
          return (
            <div className="update" key={index}>
              <img src={update.img? update.img : noImage} alt="profile" />
              <div className="details">
                <div className="info">
                  <span><Link to={update.url} target="_blank">{update.name}</Link></span>
                  <p> {update.noti}</p>
                </div>
                <p>Published:<span> {update.time}</span></p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

};

export default Updates;