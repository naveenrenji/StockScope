const express = require("express");
const router = express.Router();
const redis = require("redis");
const helper = require("../helpers");
const client = redis.createClient();
client.connect().then(() => { });
const axios = require("axios");
require("dotenv").config();


router.route("/trending-stocks").get(async (req, res) => {
    let stocksData = [];
    let temp, temp1;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    try {

        //Checking if the data is present in the cache or not
        if (await client.get(`trending-stocks:${formattedDate}`)) {

            console.log("Data fetched from redis");
            let stringData = await client.get(`trending-stocks:${formattedDate}`);
            stocksData = JSON.parse(stringData);
            return res.status(200).json(stocksData);
        }

        //If the data is not present in the redis cache fetch the data from the api
        const options = {
            method: 'GET',
            url: 'https://yahoo-finance15.p.rapidapi.com/api/yahoo/co/collections/most_actives',
            params: {start: '0'},
            headers: {
              'X-RapidAPI-Key': process.env.YAHOO_FINANCE_API_KEY,
              'X-RapidAPI-Host': process.env.YAHOO_FINANCE_API_HOST
            }
          };
          
        let { data } = await axios.request(options);
        //If the data is not present we will throw 404 along with data not found message
        if (Object.keys(data).length === 0) {

            const error = new Error("Data not found");
            error.statusCode = 404;
            throw error;
        }

        temp = {...data};
        temp1 = temp.quotes;
        temp1 = temp1.slice(0, 5);

        for (const stock of temp1) {
            let stockDataObj = {
                name: stock.displayName || stock.shortName || stock.longName,
                symbol: stock.symbol,
                price: stock.regularMarketPrice,
                change: stock.regularMarketChange
            };
            stocksData.push(stockDataObj);
        }

        console.log("Data fetched from api");
        //convert the data to the string
        let stringData = JSON.stringify(stocksData);

        await client.set(`trending-stocks:${formattedDate}`, stringData);
        await client.expire(`trending-stocks:${formattedDate}`, 100);
    }
    catch (error) {
        return res.status(error.statusCode).json({
            error: error.message
        })
    }
    return res.status(200).json(
        stocksData);
});

router.route("/general-news")
    .get(async (req, res) => {
        let newsData = [];
        let temp, temp1;
            let currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString();

        try {
            
            if (await client.exists(`general-news:${formattedDate}`)) {
                console.log("Data fetched from redis");
                let stringData = await client.get(`general-news:${formattedDate}`);
                newsData = JSON.parse(stringData);

                return res.status(200).json(newsData);
            }

            let { data } = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);

            //If the data is not present we will throw 404 along with data not found message
            if (Object.keys(data).length === 0) {

                const error = new Error("Data not found");
                error.statusCode = 404;
                throw error;
            }

            temp = { ...data };
            temp1 = temp.feed;

            for (const news of temp1) {
                currentDate = new Date();
                let image = (news.banner_image != null) ? news.banner_image : "";

                let newsObj = {
                    img: image,
                    name: news.title,
                    noti: news.summary,
                    time: helper.getTimeDifference(news.time_published)
                };
                newsData.push(newsObj);
            }

            console.log("Data Fetched from api");
            let stringData = JSON.stringify(newsData);

            await client.set(`general-news:${formattedDate}`, stringData);
            await client.expire(`general-news:${formattedDate}`, 180);

        } catch (error) {
            return res.status(error.statusCode).json({
                error: error.message
            })
        }

        return res.status(200).json(newsData);
    });

module.exports = router;