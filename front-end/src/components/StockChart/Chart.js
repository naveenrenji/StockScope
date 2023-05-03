import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const Chart = (props) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Stock Price',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          },
        ],
      });
        const [resolution, setResolution] = useState('1');
  const [timeframe, setTimeframe] = useState('1w');

  const fetchData = async () => {
    const now = Math.floor(Date.now() / 1000);
    let from;

    switch (timeframe) {
      case '1y':
        from = now - 31536000;
        break;
      case '6m':
        from = now - 15768000;
        break;
      case '1m':
        from = now - 2592000;
        break;
      case '1w':
      default:
        from = now - 604800;
        break;
    }

    try {
      const response = await fetch(`http://localhost:3001/chart/${props.symbol}/${resolution}/${from}/${now}`);
      const data = await response.json();

      if (data.s === 'ok' && data.t && data.c) {
        setChartData({
          labels: data.t.map((timestamp) => new Date(timestamp * 1000).toLocaleString()),
          datasets: [
            {
              label: 'Stock Price',
              data: data.c,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
            },
          ],
        });
      } else {
        console.error('Error fetching stock candles data');
      }
    } catch (error) {
      console.error('Error fetching stock candles data:', error);
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

  return (
    <div>
      <h2>Stock Chart</h2>
      <Line data={chartData} />
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

export default Chart;
