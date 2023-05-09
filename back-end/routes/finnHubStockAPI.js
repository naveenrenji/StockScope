const express = require("express");
const router = express.Router();
const axios = require("axios");

const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

require("dotenv").config();

//cause dotenv isnt working for some reason.
const finnhubApiKey = "cgvbft1r01qqk0dog72gcgvbft1r01qqk0dog730";

router.route("/:symbol/:resolution/:from/:to").get(async (req, res) => {
  const { symbol, resolution, from, to } = req.params;
  let url = `https://finnhub.io/api/v1//stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${finnhubApiKey}`;

  try {
    let data = await axios.get(url);
    await client.set(`company-overview:${stockName}`, stringData);
    await client.expire(`company-overview:${stockName}`, 100);
    return res.status(200).json(data.data);
  } catch (error) {
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
