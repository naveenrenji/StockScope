const express = require("express");
const router = express.Router();
const redis = require("redis");
require("dotenv").config();


const client = redis.createClient({
    host: process.env.REDIS_HOST || 'redis',
    port: 6379,
    url:  process.env.REDIS_HOST ? `redis://${process.env.REDIS_HOST}:6379`: `redis://localhost:6379`
});
client.connect().then(() => {
    console.log("REDIS CONNECTION IS SUCCESSFUL");
 }).catch(err => {
    console.log("INSIDE CATCH BLOCK");
    console.error(err);
});

const axios = require("axios");
const helper = require("../helpers");


router.route("/:name").get(async (req, res) => {
    let stockData, temp, temp1;
    let updatedTemp1 = {};

    try {

        let stockName = req.params.name;
        helper.checkStockName(stockName);
        stockName = stockName.toUpperCase();


        //Checking if the data is present in the cache or not
        if (await client.get(`company-overview:${stockName}`)) {

            console.log("Data fetched from redis");
            let stringData = await client.get(`company-overview:${stockName}`);
            stockData = JSON.parse(stringData);
            return res.status(200).json(stockData);
        }

        //If the data is not present in the redis cache fetch the data from the api
        let { data } = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockName}&apikey=${"CG1R8C3YO1K5CFYX"}`);


        //If the data is not present we will throw 404 along with data not found message
        if (Object.keys(data).length === 0) {

            const error = new Error("Data not found");
            error.statusCode = 404;
            throw error;
        }

        temp = { ...data };


        let finhubb_data = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${stockName}&token=${"cgvbft1r01qqk0dog72gcgvbft1r01qqk0dog730"}`);
        temp1 = finhubb_data.data;

        updatedTemp1["Current Price"] = temp1["c"];
        updatedTemp1["Change"] = temp1["d"];
        updatedTemp1["Percent Change"] = temp1["dp"];
        updatedTemp1["High"] = temp1["h"];
        updatedTemp1["Low"] = temp1["l"];
        updatedTemp1["Open"] = temp1["o"];
        updatedTemp1["Previous Close"] = temp1["pc"];

        //Removing 
        stockData = {
            ...updatedTemp1,
            ...temp,
        }

        console.log("Data fetched from api");
        //convert the data to the string
        let stringData = JSON.stringify(stockData);

        await client.set(`company-overview:${stockName}`, stringData);
        await client.expire(`company-overview:${stockName}`, 100);
    }
    catch (error) {
        return res.status(error.statusCode).json({
            error: error.message
        })
    }
    return res.status(200).json(
        stockData);
});


router.route("/news/:name").get(async (req, res) => {

    let newsData;

    try {

        let stockName = req.params.name;
        helper.checkStockName(stockName);
        stockName = stockName.toUpperCase();

        //Checking if the data is present in the cache or not
        if (await client.get(`news:${stockName}`)) {

            console.log("data fetched from redis");
            let stringData = await client.get(`news:${stockName}`);
            newsData = JSON.parse(stringData);
            return res.status(200).json(newsData);
        }

        // current date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;

        // last week date
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 3);
        const lastWeekYear = lastWeek.getFullYear();
        const lastWeekMonth = String(lastWeek.getMonth() + 1).padStart(2, '0');
        const lastWeekDay = String(lastWeek.getDate()).padStart(2, '0');
        const lastWeekDate = `${lastWeekYear}-${lastWeekMonth}-${lastWeekDay}`;

        let { data } = await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${stockName}&from=${lastWeekDate}&to=${currentDate}&token=${"cgvbft1r01qqk0dog72gcgvbft1r01qqk0dog730"}`);

        //If the data is not present we will throw 404 along with data not found message
        if (Object.keys(data).length === 0) {

            const error = new Error("Data not found");
            error.statusCode = 404;
            throw error;
        }
        console.log("Data fetched from api");
        //convert the data to the string
        let stringData = JSON.stringify(data);

        await client.set(`news:${stockName}`, stringData);
        await client.expire(`news:${stockName}`, 300);
        newsData = data;
    }

    catch (error) {

        console.log(error);

        return res.status(error.statusCode).json({
            error: error.message
        });
    }

    return res.status(200).json(newsData);
});


router.route("/income-statement/:name").get(async (req, res) => {

    let incomeData = {};

    try {

        let stockName = req.params.name;
        helper.checkStockName(stockName);
        stockName = stockName.toUpperCase();

        //Checking if the data is present in the cache or not
        if (await client.get(`income-statement:${stockName}`)) {

            console.log("data fetched from redis");
            let stringData = await client.get(`income-statement:${stockName}`);
            incomeData = JSON.parse(stringData);
            return res.status(200).json(incomeData);
        }

        //If the data is not present in the redis cache fetch the data from the api
        let { data } = await axios.get(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${stockName}&apikey=${"CG1R8C3YO1K5CFYX"}`);

        //If the data is not present we will throw 404 along with data not found message
        if (Object.keys(data).length === 0) {

            const error = new Error("Data not found");
            error.statusCode = 404;
            throw error;
        }

        //Structuring the data 
        let keys = Object.keys(data.annualReports[0]);

        let annual_records = {};

        for (let i = 0; i < keys.length; i++) {

            let temp = [];
            temp.push(data.annualReports[0][keys[i]]);
            temp.push(data.annualReports[1][keys[i]]);
            temp.push(data.annualReports[2][keys[i]]);
            temp.push(data.annualReports[3][keys[i]]);
            temp.push(data.annualReports[4][keys[i]]);
            let new_key = keys[i];
            annual_records[new_key] = temp;
        }

        let quarter_records = {};
        keys = Object.keys(data.quarterlyReports[0]);

        for (let i = 0; i < keys.length; i++) {

            let temp = [];
            temp.push(data.quarterlyReports[0][keys[i]]);
            temp.push(data.quarterlyReports[1][keys[i]]);
            temp.push(data.quarterlyReports[2][keys[i]]);
            temp.push(data.quarterlyReports[3][keys[i]]);
            temp.push(data.quarterlyReports[4][keys[i]]);
            let new_key = keys[i];
            quarter_records[new_key] = temp;
        }

        let final_data = {}

        final_data["symbol"] = data["symbol"];
        final_data["annualReports"] = annual_records;
        final_data["quarterlyReports"] = quarter_records;
        let stringData = JSON.stringify(final_data);

        await client.set(`income-statement:${stockName}`, stringData);
        await client.expire(`income-statement:${stockName}`, 10000);
        incomeData = { ...final_data };
    }
    catch (error) {

        console.log(error);
        return res.status(error.statusCode).json({
            error: error.message
        });
    }
    return res.status(200).json(incomeData);
})


router.route("/balance-sheet/:name").get(async (req, res) => {

    let balanceData;

    try {

        let stockName = req.params.name;
        helper.checkStockName(stockName);
        stockName = stockName.toUpperCase();

        //Checking if the data is present in the cache or not
        if (await client.get(`balance-sheet:${stockName}`)) {

            console.log("data fetched from redis");
            let stringData = await client.get(`balance-sheet:${stockName}`);
            balanceData = JSON.parse(stringData);
            return res.status(200).json(balanceData);
        }

        //If the data is not present in the redis cache fetch the data from the api
        let { data } = await axios.get(`https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${stockName}&apikey=${"CG1R8C3YO1K5CFYX"}`);

        //If the data is not present we will throw 404 along with data not found message
        if (Object.keys(data).length === 0) {

            const error = new Error("Data not found");
            error.statusCode = 404;
            throw error;
        }

        //Structuring the data 
        let keys = Object.keys(data.annualReports[0]);
        let annual_records = {};

        for (let i = 0; i < keys.length; i++) {

            let temp = [];
            temp.push(data.annualReports[0][keys[i]]);
            temp.push(data.annualReports[1][keys[i]]);
            temp.push(data.annualReports[2][keys[i]]);
            temp.push(data.annualReports[3][keys[i]]);
            temp.push(data.annualReports[4][keys[i]]);
            let new_key = keys[i];
            annual_records[new_key] = temp;
        }

        let quarter_records = {};
        keys = Object.keys(data.quarterlyReports[0]);

        for (let i = 0; i < keys.length; i++) {

            let temp = [];
            temp.push(data.quarterlyReports[0][keys[i]]);
            temp.push(data.quarterlyReports[1][keys[i]]);
            temp.push(data.quarterlyReports[2][keys[i]]);
            temp.push(data.quarterlyReports[3][keys[i]]);
            temp.push(data.quarterlyReports[4][keys[i]]);
            let new_key = keys[i];
            quarter_records[new_key] = temp;
        }

        let final_data = {}

        final_data["symbol"] = data["symbol"];
        final_data["annualReports"] = annual_records;
        final_data["quarterlyReports"] = quarter_records;


        let stringData = JSON.stringify(final_data);

        await client.set(`balance-sheet:${stockName}`, stringData);
        await client.expire(`balance-sheet:${stockName}`, 11000);
        balanceData = { ...final_data };
    }
    catch (error) {

        console.log(error);
        return res.status(error.statusCode).json({
            error: error.message
        });
    }
    return res.status(200).json(balanceData);
})


router.route("/cash-flow/:name").get(async (req, res) => {

    let cashFlowData;

    try {

        let stockName = req.params.name;
        helper.checkStockName(stockName);
        stockName = stockName.toUpperCase();

        //Checking if the data is present in the cache or not
        if (await client.get(`cash-flow:${stockName}`)) {

            console.log("data fetched from redis");
            let stringData = await client.get(`cash-flow:${stockName}`);
            cashFlowData = JSON.parse(stringData);
            return res.status(200).json(cashFlowData);
        }

        //If the data is not present in the redis cache fetch the data from the api
        let { data } = await axios.get(`https://www.alphavantage.co/query?function=CASH_FLOW&symbol=${stockName}&apikey=${"CG1R8C3YO1K5CFYX"}`);

        //If the data is not present we will throw 404 along with data not found message
        if (Object.keys(data).length === 0) {

            const error = new Error("Data not found");
            error.statusCode = 404;
            throw error;
        }

        //Structuring the data 
        let keys = Object.keys(data.annualReports[0]);
        let annual_records = {};

        for (let i = 0; i < keys.length; i++) {

            let temp = [];
            temp.push(data.annualReports[0][keys[i]]);
            temp.push(data.annualReports[1][keys[i]]);
            temp.push(data.annualReports[2][keys[i]]);
            temp.push(data.annualReports[3][keys[i]]);
            temp.push(data.annualReports[4][keys[i]]);
            let new_key = keys[i];
            annual_records[new_key] = temp;
        }

        let quarter_records = {};
        keys = Object.keys(data.quarterlyReports[0]);

        for (let i = 0; i < keys.length; i++) {

            let temp = [];
            temp.push(data.quarterlyReports[0][keys[i]]);
            temp.push(data.quarterlyReports[1][keys[i]]);
            temp.push(data.quarterlyReports[2][keys[i]]);
            temp.push(data.quarterlyReports[3][keys[i]]);
            temp.push(data.quarterlyReports[4][keys[i]]);
            let new_key = keys[i];
            quarter_records[new_key] = temp;
        }

        let final_data = {}

        final_data["symbol"] = data["symbol"];
        final_data["annualReports"] = annual_records;
        final_data["quarterlyReports"] = quarter_records;

        let stringData = JSON.stringify(final_data);

        await client.set(`cash-flow:${stockName}`, stringData);
        await client.expire(`cash-flow:${stockName}`, 12000);
        cashFlowData = { ...final_data };
    }
    catch (error) {

        console.log(error);
        return res.status(error.statusCode).json({
            error: error.message
        });
    }
    return res.status(200).json(cashFlowData);
})

module.exports = router;