import React from "react";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import axios from "axios";


const CustomerReview = () => {

  const [indexData, setIndexData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renderCount, setRenderCount] = useState(0);

  let data = {
    series: [
      {
        name: "Review",
        data: [10, 50, 30, 90, 40, 120, 100],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: "auto",
      },

      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#ff929f"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19 00:00:00.000",
          "2018-09-19 01:30:00.000",
          "2018-09-19 02:30:00.000",
          "2018-09-19 03:30:00.000",
          "2018-09-19 04:30:00.000",
          "2018-09-19 05:30:00.000",
          "2018-09-19 06:30:00.000",
        ],
      },
      yaxis: {
        show: false
      },
      toolbar:{
        show: false
      }
    },
  };

  useEffect(()=>{
    const interval = setInterval(() => {
      setRenderCount((prevCount) => prevCount + 1);
    }, (60*60*60000));

    async function fetchData(){
      try {
        let {data} = await axios.get('http://localhost:3001/screener/index-data');
        setIndexData(data);
        setLoading(false)
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

  if (loading) {
    return (
      <div className='CustomerReview'>
        <h3>Loading....</h3>
      </div>
    );
  }

  if(indexData){
    let copyData = {...indexData};
    for(let i=0; i<copyData.prices.length; i++){
      copyData.prices[i] = Number.parseFloat(copyData.prices[i]).toFixed(2);
    }
    data.series[0].data = copyData.prices;
    data.options.xaxis.categories = copyData.timestamps;
  }

  return <div className="CustomerReview">
        <Chart options={data.options} series={data.series} type="area" />
  </div>;
};

export default CustomerReview;
