import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// function formatDate(date) {
//     var year = date.getFullYear();
//     var month = (date.getMonth() + 1);
//     var day = date.getDate();

//     month = month < 10 ? "0" + month : month;
//     day = day < 10 ? "0" + day : day;

//     return year + "-" + month + "-" + day;
// }

function getDetail(queryParam) {
    const url = `http://131.181.190.87:3001/history?symbol=${queryParam}`;

    return fetch(url)
        .then((res) => res.json())
        .catch((e) => {
            console.log(e);
        });
}

function Header(props) {
    return (
        <div>
            <h1>Showing stocks for {props.queryStock}</h1>
        </div>
    );
}

function DateSearch(props) {
    const searchDate = props.searchDate;
    const setSearchDate = props.setSearchDate;

    return (
        <div className="dateSearch">
            <label>Showing detail from </label>
            <DatePicker
                className="datePicker"
                placeholderText="Select a start date"
                dateFormat="yyyy-MM-dd"
                selected={searchDate}
                onChange={(searchDate) => {
                    setSearchDate(new Date(searchDate));
                }}
            />
        </div>
    );
}

function DetailTable(props) {
    const [originalData, setOriginalData] = useState([]);
    const columns = [
        { headerName: "Date", field: "date" },
        { headerName: "Open", field: "open" },
        { headerName: "High", field: "high" },
        { headerName: "Low", field: "low" },
        { headerName: "Close", field: "close" },
        { headerName: "Volume", field: "volume" }
    ]

    useEffect(() => {
        if (originalData.length === 0) {
            getDetail(props.queryParam)
                .then((details) => details.map((detail) => {
                    return {
                        date: detail.timestamp.substring(0, 10),
                        open: detail.open,
                        high: detail.high,
                        low: detail.low,
                        close: detail.close,
                        volume: detail.volumes
                    }
                }))
                .then((tableData) => {
                    setOriginalData(tableData);
                    props.setTableData(tableData);
                    props.setSearchDate(new Date(tableData[tableData.length - 1].date));
                })
        } else {
            const searchResult = originalData.filter((detail) => {
                if (new Date(detail.date).getTime() >= props.searchDate.getTime()) {
                    return {
                        date: detail.date,
                        open: detail.open,
                        high: detail.high,
                        low: detail.low,
                        close: detail.close,
                        volume: detail.volumes
                    }
                }
            });
            props.setTableData(searchResult);
        }

    }, [props.searchDate]);

    return (
        <div className="ag-theme-balham stockDetailTable">
            <AgGridReact
                columnDefs={columns}
                rowData={props.tableData}
                pagination={true}
                paginationPageSize={100}
            />
        </div>
    );
}

function Chart(props) {

    const tableData = props.tableData.slice().reverse();

    const labelData = tableData.map((data) => {
        return data.date;
    });
    const chartData = tableData.map((data) => {
        return data.close;
    })
    const data = {
        labels: labelData,
        datasets: [{
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            label: "Closing Price",
            data: chartData
        }]
    }
    const options = {
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'rgb(78, 82, 80)'
                }
            }],
            yAxes: [{
                gridLines: {
                    color: 'rgb(78, 82, 80)'
                }
            }]
        }
    }

    return (
        <div className="detailChart">
            <Line data={data} options={options} />
        </div>
    );
}

function StockDetail(props) {
    const queryParam = useQuery().get("code");
    const queryStock = props.stockName;
    const [tableData, setTableData] = useState([]);
    const [searchDate, setSearchDate] = useState();

    return (
        <div className="stockDetail">
            <Header queryStock={queryStock} />
            <DateSearch searchDate={searchDate} setSearchDate={setSearchDate} />
            <DetailTable queryParam={queryParam} tableData={tableData} setTableData={setTableData} searchDate={searchDate} setSearchDate={setSearchDate} />
            <Chart tableData={tableData} />
        </div>
    );
}

export default StockDetail;