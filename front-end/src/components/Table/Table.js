import { Table } from 'react-bootstrap';
import './Table.css';

const stocks = [
  { name: "Apple Inc.", symbol: "AAPL", price: 128.47, change: -1.23 },
  { name: "Tesla, Inc.", symbol: "TSLA", price: 716.56, change: 0.78 },
  { name: "Microsoft Corporation", symbol: "MSFT", price: 246.47, change: 2.19 },
  { name: "Amazon.com, Inc.", symbol: "AMZN", price: 3157.00, change: -0.23 },
  { name: "Facebook, Inc.", symbol: "FB", price: 297.89, change: -1.56 },
];

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
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td style={{padding: "15px"}}>{stock.name}</td>
              <td style={{padding: "15px"}}>{stock.symbol}</td>
              <td style={{padding: "15px"}}>${stock.price.toFixed(2)}</td>
              <td style={{padding: "15px"}}>
                <span className="change" style={makeStyle(stock.change)}>{stock.change}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
