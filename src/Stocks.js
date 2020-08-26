import React, { useEffect, useState } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import Select from 'react-select';
import { Link } from "react-router-dom";

function getAllStocks() {
    const url = "http://131.181.190.87:3001/all";

    return fetch(url)
        .then((res) => res.json())
        .catch((e) => {
            console.log(e);
        });
}

function AllDataTable(props) {
    const symbolTerm = props.symbolTerm;
    const industrialTerm = props.industrialTerm.value;
    const [stocksData, setStocksData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const columns = [
        {
            headerName: "Stock",
            field: "symbol",
            width: 300,
            cellRendererFramework: (params) => {
                return <Link to={`/history?code=${params.value}`} onClick={() => {
                    props.setStockName(params.data.name);
                }}> {params.value} </Link>
            }
        },
        { headerName: "Name", field: "name", width: 300 },
        { headerName: "Industry", field: "industry", width: 300 }
    ];

    useEffect(() => {
        if (stocksData.length === 0) {
            getAllStocks()
                .then((data) =>
                    data.map((stock) => {
                        return {
                            symbol: stock.symbol,
                            name: stock.name,
                            industry: stock.industry
                        }
                    })
                )
                .then((stock) => {
                    setStocksData(stock);
                    setTableData(stock);
                });
        } else {
            const searchResult = stocksData.filter((stockData) => {
                if (stockData.symbol.includes(symbolTerm.toUpperCase()) && industrialTerm === "All") {
                    return {
                        symbol: stockData.symbol,
                        name: stockData.name,
                        industry: stockData.industry
                    }
                } else if (stockData.symbol.includes(symbolTerm.toUpperCase()) && stockData.industry === industrialTerm) {
                    return {
                        symbol: stockData.symbol,
                        name: stockData.name,
                        industry: stockData.industry
                    }
                }
            });
            setTableData(searchResult);
        }
    }, [symbolTerm, industrialTerm]);

    return (
        <div className="ag-theme-balham stockTable">
            <AgGridReact
                columnDefs={columns}
                rowData={tableData}
                pagination={true}
                paginationPageSize={100}
            />
        </div>
    );
}

function Header() {
    return (
        <div>
            <h1>Listing all stocks</h1>
        </div>
    );
}

function SearchBar(props) {
    const [symbolTerm, setSymbolTerm] = useState("");
    const industryOption = [
        { label: "All", value: "All" },
        { label: "Consumer Discretionary", value: "Consumer Discretionary" },
        { label: "Consumer Staples", value: "Consumer Staples" },
        { label: "Energy", value: "Energy" },
        { label: "Financials", value: "Financials" },
        { label: "Health Care", value: "Health Care" },
        { label: "Industrials", value: "Industrials" },
        { label: "Information Technology", value: "Information Technology" },
        { label: "Materials", value: "Materials" },
        { label: "Real Estate", value: "Real Estate" },
        { label: "Telecommunication Services", value: "Telecommunication Services" },
        { label: "Utilities", value: "Utilities" }
    ];

    return (
        <div className="stockSearch">
            <div className="symbolSearch">
                <label>Search by Symbol</label><br />
                <input className="symbolInput" type="text" name="symbolSearch" value={symbolTerm} onChange={
                    (e) => {
                        setSymbolTerm(e.target.value);
                    }
                } />
                <button className="symbolSearchButton" type="search" onClick={() => {
                    props.onSymbolSubmit(symbolTerm);
                }}>Search</button>
            </div>
            <div className="industrySearch">
                <label>Search by Industry</label>
                <Select value={props.industrialTerm} options={industryOption} onChange={
                    (value) => {
                        props.onIndustrialChanged(value);
                    }
                } />
            </div>
        </div>
    )
}

function Stocks(props) {
    const [symbolTerm, setSymbolTerm] = useState("");
    const [industrialTerm, setIndustrialTerm] = useState({ label: "All", value: "All" });

    return (
        <div className="stocks">
            <Header />
            <SearchBar onSymbolSubmit={setSymbolTerm} industrialTerm={industrialTerm} onIndustrialChanged={setIndustrialTerm} />
            <AllDataTable symbolTerm={symbolTerm} industrialTerm={industrialTerm} setStockName={props.setStockName} />
        </div>
    );
}

export default Stocks;