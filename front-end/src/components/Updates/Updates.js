import React from "react";
import axios from "axios";
import "./Updates.css";
import { useState, useEffect } from 'react';

const Updates = () => {
  const [UpdatesData, setUpdatesData] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const interval = setInterval(() => {
      setRenderCount((prevCount) => prevCount + 1);
    }, 120000); // 120 seconds

    async function fetchData(){
      try {
        const {data} = await axios.get('http://localhost:3001/screener/general-news');
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
  },[renderCount]);

  if(loading){
    return (
      <div className='Updates'>
          <h3>Loading....</h3>
      </div>
    )
  }else{
    return (
    <div className="Updates">
      {UpdatesData.map((update, index) => {
        return (
          <div className="update" key={index}>
            <img src={update.img} alt="profile" />
            <div className="noti">
              <div style={{ marginBottom: "0.5rem" }}>
                <span>{update.name}</span>
                <span> {update.noti}</span>
              </div>
              <span>{update.time}</span>
            </div>
          </div>
        );
      })}
    </div>
    );
  }

};

export default Updates;