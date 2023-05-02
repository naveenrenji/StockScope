import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const StockChart = (props) => {
    const [chartData, setChartData] = useState({
        series: [
          {
            data: []
          }
        ]
      });
        const [resolution, setResolution] = useState("1");
  const [timeframe, setTimeframe] = useState("1w");

  const fetchData = async () => {
    const now = Math.floor(Date.now() / 1000);
    let from;

    switch (timeframe) {
      case "1y":
        from = now - 31536000;
        break;
      case "6m":
        from = now - 15768000;
        break;
      case "1m":
        from = now - 2592000;
        break;
      case "1w":
      default:
        from = now - 604800;
        break;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/chart/${props.symbol}/${resolution}/${from}/${now}`
      );
      const data = await response.json();

      if (data.s === "ok") {
        setChartData({
          series: [
            {
              data: data.t.map((timestamp, index) => {
                return {
                  x: new Date(timestamp * 1000),
                  y: [
                    data.o[index],
                    data.h[index],
                    data.l[index],
                    data.c[index],
                  ],
                };
              }),
            },
          ],
        });
      } else {
        console.error("Error fetching stock candles data");
      }
    } catch (error) {
      console.error("Error fetching stock candles data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [resolution, timeframe]);

  const handleResolutionChange = (event) => {
    setResolution(event.target.value);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "Stock Price",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div>
      <h2>Stock Chart</h2>
      {chartData.series && chartData.series.length > 0 ? (
        <ApexCharts
          options={chartOptions}
          series={chartData.series}
          type="candlestick"
          height={350}
        />
      ) : (
        <p>Loading chart...</p>
      )}
      <label>
        Resolution:
        <select value={resolution} onChange={handleResolutionChange}>
          <option value="1">1 min</option>
          <option value="5">5 min</option>
          <option value="15">15 min</option>
          <option value="30">30 min</option>
          <option value="60">1 hour</option>
          <option value="D">1 day</option>
          <option value="W">1 week</option>
          <option value="M">1 month</option>
        </select>
      </label>
      <label>
        Timeframe:
        <select value={timeframe} onChange={handleTimeframeChange}>
          <option value="1w">1 week</option>
          <option value="1m">1 month</option>
          <option value="6m">6 months</option>
          <option value="1y">1 year</option>
        </select>
      </label>
    </div>
  );
  
};

export default StockChart;
