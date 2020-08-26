import React, { useState } from 'react';
import './App.css';
import Home from './Home';
import Stocks from './Stocks';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import StockDetail from './StockDetail';


function App() {
    const [stockName, setStockName] = useState("");

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <div className="title">
                            <h1>IFN666 Stock Prices</h1>
                        </div>
                        <li>
                            <Link className="route" to="/">Home</Link>
                        </li>
                        <li>
                            <Link className="route" to="/stocks">Stocks</Link>
                        </li>
                    </ul>
                </nav>

                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/stocks">
                        <Stocks setStockName={setStockName} />
                    </Route>
                    <Route path="/history">
                        <StockDetail stockName={stockName} />
                    </Route>
                </Switch>

            </div>
        </Router>
    );
}

export default App;