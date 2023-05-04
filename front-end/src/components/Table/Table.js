import { Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './Table.css';
import axios from 'axios';

const makeStyle = (change) => {
  if (change > 0) {
    return {
      background: 'rgb(145 254 159 / 47%)',
      color: 'green',
    }
  }
  else if (change < 0) {
    return {
      background: '#ffadad8f',
      color: 'red',
    }
  }
  else {
    return {
      background: '#59bfff',
      color: 'white',
    }
  }
}

export default function BasicTable() {

  const [stocksData, setStocksData] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCount((prevCount) => prevCount + 1);
    }, 60000); // 60 seconds

    async function fetchData() {
      try {
        let { data } = await axios.get('http://localhost:3001/screener/trending-stocks');
        setStocksData(data);
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
      <div className='Table'>
        <h3>Loading....</h3>
      </div>
    );
  } else {
    return (
      <div className="Table">
        <h3>Trending Stocks</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {stocksData && stocksData.map((stock) => (
              <tr key={stock.symbol}>
                <td style={{ padding: "15px" }}>{stock.name}</td>
                <td style={{ padding: "15px" }}>{stock.symbol}</td>
                <td style={{ padding: "15px" }}>${stock.price.toFixed(2)}</td>
                <td style={{ padding: "15px" }}>
                  <span className="change" style={makeStyle(stock.change)}>{stock.change.toFixed(2)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}