import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          index
          element={
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>StockScope App under Development</p>
              <a
                className="App-link"
                href="https://github.com/naveenrenji/StockScope/tree/main"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Github
              </a>
            </header>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
