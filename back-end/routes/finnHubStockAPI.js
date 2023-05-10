const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

//console.log("ENV is", process.env.REDIS_HOST);
const redis = require("redis");
let client = redis.createClient({
  host: process.env.REDIS_HOST || "redis",
  port: 6379,
  url: process.env.REDIS_HOST
    ? `redis://${process.env.REDIS_HOST}:6379`
    : `redis://localhost:6379`,
});
client
  .connect()
  .then(() => { })
  .catch((err) => console.error(err));

//cause dotenv isnt working for some reason.
const finnhubApiKey = "cgvbft1r01qqk0dog72gcgvbft1r01qqk0dog730";

router.route("/:symbol/:resolution/:from/:to").get(async (req, res) => {
  let stockData;
  const { symbol, resolution, from, to } = req.params;
  let url = `https://finnhub.io/api/v1//stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${finnhubApiKey}`;

  try {
    if (await client.exists(`chart-data:${symbol}`)) {
      let stringData = await client.get(`chart-data:${symbol}`);
      stockData = JSON.parse(stringData);
    }
    else {
      const { data } = await axios.get(url);
      stockData = data;
      let stringData = JSON.stringify(stockData);
      await client.set(`chart-data:${symbol}`, stringData);
      await client.expire(`chart-data:${symbol}`, 100);
    }
    return res.status(200).json(stockData);
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }
});

router.route("/:symbol").get(async (req, res) => {
  try {
    let symbol = req.params.symbol;
    let temp = await client.get(`stock-symbol:${symbol}`);
    if (temp) {
      let data = JSON.parse(temp);
      return res.status(200).json(data);
    }
    let url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`;
    let { data } = await axios.get(url);
    console.log(data);
    await client.set(`stock-symbol:${symbol}`, JSON.stringify(data));
    await client.expire(`stock-symbol:${symbol}`, 72000);
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
  // https://finnhub.io/api/v1/quote?symbol=AAPL&token=cgvbft1r01qqk0dog72gcgvbft1r01qqk0dog730
});

module.exports = router;
