//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/createUser", async (req, res) => {
  const tempUser = await User.findOne({ email: req.body.email });
  console.log(tempUser);
  if (tempUser) {
    res.status(200).json({ Error: "User already exists" });
    return;
  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    type: "user",
    portfolios: [
      {
        name: "default",
        stocks: [],
      },
    ],
  });
  try {
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.post("/getUserPortfolios", async (req, res) => {
  try{
    let user = await User.findOne({email: req.body.email});
    return res.status(200).json(user);
  }catch(e){
    return res.status(500).json(e);
  }
});

router.post("/createNewPortfolio", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    for (let portfolio of user.portfolios) {
      if (portfolio.name === req.body.portfolioName) {
        return res.status(400).json({ error: "Portfolio already exists" });
      }
    }
    user.portfolios.push({
      name: req.body.portfolioName,
      stocks: [],
    });
    let portfolio = await user.save();
    return res.status(200).json(portfolio);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.post("/addStockToPortfolio", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    //return res.status(200).json(user);
    console.log(user);
    let stockIndex = -1;
    let portfolioIndex = -1;
    for (let i in user.portfolios) {
      //console.log(user.portfolios[i].name);
      if (user.portfolios[i].name === req.body.portfolioName) {
        //console.log(i);
        portfolioIndex = i;
        for (let j in user.portfolios[i].stocks) {
          console.log(user.portfolios[i].stocks[j]);
          if (user.portfolios[i].stocks[j].name === req.body.stockName) {
            stockIndex = j;
          }
        }
      }
    }
    console.log(portfolioIndex, stockIndex);

    if (portfolioIndex === -1) {
      return res.status(400).json({ error: "Portfolio does not exist" });
    }

    if (stockIndex === -1) {
      user.portfolios[portfolioIndex].stocks.push({
        name: req.body.stockName,
        symbol: req.body.symbol,
        avg_buy_price: req.body.price,
        no_of_shares: req.body.shares,
        lots: [
          {
            shares: req.body.shares,
            price: req.body.price,
            date: Date(),
          },
        ],
      });
    } else {
      user.portfolios[portfolioIndex].stocks[stockIndex].lots.push({
        shares: req.body.shares,
        price: req.body.price,
        date: Date(),
      });
      let sum = 0;
      let numOfShares = 0;
      console.log(
        user.portfolios[portfolioIndex].stocks[stockIndex].lots.length
      );
      for (let unit of user.portfolios[portfolioIndex].stocks[stockIndex]
        .lots) {
        //console.log(unit);
        if (unit.price && unit.shares) {
          sum += unit.price * unit.shares;
          numOfShares += unit.shares;
          console.log(numOfShares, sum);
        }
      }
      user.portfolios[portfolioIndex].stocks[stockIndex].avg_buy_price = Number(
        sum / numOfShares
      );
      user.portfolios[portfolioIndex].stocks[stockIndex].no_of_shares =
        Number(numOfShares);
    }
    let updatedUser = await user.save();
    return res.status(200).json(updatedUser);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

router.post("/updateStockPortfolio", async (req, res) => {

});

module.exports = router;
