const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

//cause dotenv isnt working for some reason.
const finnhubApiKey = "cgvbft1r01qqk0dog72gcgvbft1r01qqk0dog730";


router.route("/:symbol/:resolution/:from/:to").get(async (req, res) => {
  const { symbol, resolution, from, to } = req.params;
 let url = `https://finnhub.io/api/v1//stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${finnhubApiKey}`;
    
  try {
    let data  = await axios.get(url);
    res.status(200).json(data.data);
  } catch (error) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }
});

module.exports = router;
