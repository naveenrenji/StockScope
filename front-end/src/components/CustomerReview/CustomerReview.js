import React, { useEffect, useState, useMemo, useCallback } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

const CustomerReview = () => {
  const [indexData, setIndexData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renderCount, setRenderCount] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      let { data } = await axios.get(
        "http://localhost:3001/screener/index-data"
      );
      setIndexData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchData, intervalId]);

  useEffect(() => {
    setIntervalId(
      setInterval(() => {
        setRenderCount((prevCount) => prevCount + 1);
      }, 60 * 60 * 60000)
    );
  }, []);

  const chartData = useMemo(() => {
    if (indexData) {
      let copyData = { ...indexData };
      for (let i = 0; i < copyData.prices.length; i++) {
        copyData.prices[i] = Number.parseFloat(copyData.prices[i]).toFixed(2);
      }
      const seriesData = {
        name: "Review",
        data: copyData.prices,
      };
      const optionsData = {
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
          categories: copyData.timestamps,
        },
        yaxis: {
          show: false,
        },
        toolbar: {
          show: false,
        },
      };
      return {
        series: [seriesData],
        options: optionsData,
      };
    } else {
      return null;
    }
  }, [indexData]);

  if (loading) {
    return (
      <div className="CustomerReview">
        <h3>Loading....</h3>
      </div>
    );
  }

  return (
    <div className="CustomerReview">
      {chartData && (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
        />
      )}
    </div>
  );
};

export default CustomerReview;
