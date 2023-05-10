import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart, BarChart, AreaChart,
  Line, Bar, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

import './Chart.css';

const Chart = (props) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Stock Price",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  });
  const [chartType, setChartType] = useState("line");
  const [resolution, setResolution] = useState("W");
  const [timeframe, setTimeframe] = useState("1y");

  const getResolutionOptions = () => {
    switch (timeframe) {
      case "1y":
        return [
          { value: "D", label: "1 day" },
          { value: "W", label: "1 week" },
          { value: "M", label: "1 month" },
        ];
      case "6m":
        return [
          { value: "D", label: "1 day" },
          { value: "W", label: "1 week" },
          { value: "M", label: "1 month" },
        ];
      case "1m":
        return [
          { value: "D", label: "1 day" },
          { value: "W", label: "1 week" },
          { value: "60", label: "1 hour" },
        ];
      case "1w":
      default:
        return [
          { value: "30", label: "30 min" },
          { value: "60", label: "1 hour" },
          { value: "D", label: "1 day" },
          { value: "W", label: "1 week" },
          { value: "M", label: "1 month" },
        ];
    }
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
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
        console.log(data);
        console.log(`Resolution: ${resolution}, From: ${from}, To: ${now}`);
        if (data.s === "ok" && data.t && data.c) {
          setChartData(
            data.t.map((timestamp, index) => ({
              date: new Date(timestamp * 1000).toLocaleDateString(),
              price: data.c[index],
            }))
          );
        } else {
          console.error("Error fetching stock graph data");
        }
      } catch (error) {
        console.error("Error fetching stock graph data:", error);
      }
    }

    fetchData();
    // const interval = setInterval(fetchData, 5000);
    // return () => clearInterval(interval);
  }, [props.symbol, resolution, timeframe]);

  const handleResolutionChange = (event) => {
    setResolution(event.target.value);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <div>
      <h2>Stock Chart</h2>
      <ResponsiveContainer width="100%" height={410}>
        {chartType === "line" ? (
          <LineChart {...{
            data: chartData,
            margin: { top: 5, right: 20, bottom: 5, left: 0 },
          }}>
            <Line type="monotone" dataKey="price" stroke="#8884d8" yAxisId={0} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
          </LineChart>
        ) : chartType === "bar" ? (
          <BarChart {...{
            data: chartData,
            margin: { top: 5, right: 20, bottom: 5, left: 0 },
          }}>
            <Bar dataKey="price" fill="#8884d8" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
          </BarChart>
        ) : chartType === "area" ? (
          <AreaChart {...{
            data: chartData,
            margin: { top: 5, right: 20, bottom: 5, left: 0 },
          }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="price"
              stroke="#000000"
              fill="url(#colorUv)"
            />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
          </AreaChart>
        ) : (
          "area"
        )}
      </ResponsiveContainer>
      <label>
        Chart Type:
        <select value={chartType} onChange={handleChartTypeChange}>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="area">Area</option>
        </select>
      </label>
      <label>
        Resolution:
        <select value={resolution} onChange={handleResolutionChange}>
          {getResolutionOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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

export default Chart;