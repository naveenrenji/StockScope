const express = require("express");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => { });
const axios = require("axios");
const helper = require("../helpers");
require("dotenv").config();


router.route("/:name").get(async (req, res) => {
    let stockData, temp, temp1;

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
        let { data } = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockName}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);


        //If the data is not present we will throw 404 along with data not found message
        if (Object.keys(data).length === 0) {

            const error = new Error("Data not found");
            error.statusCode = 404;
            throw error;
        }

        temp = { ...data };

        let finhubb_data = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${stockName}&token=${process.env.FINNHUB_API_KEY}`);
        temp1 = finhubb_data.data;
        stockData = {
            ...temp,
            ...temp1
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
    return res.status(200).json(stockData);
});

module.exports = router;