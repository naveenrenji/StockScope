//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const helper = require("../helpers");
const User = require("../models/User");

router.post("/createUser", async (req, res) => {
  const tempUser = await User.findOne({ email: req.body.email });
  console.log(tempUser);
  if (tempUser) {
    res.status(200).json({ Error: "User already exists" });
    return;
  }
  try{
    helper.checkName(req.body.name);
    helper.check
  } catch(e){

  }
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    type: "user",
    photoUrl: "",
    about: "",
    portfolios: [
      {
        name: "default",
        net_profit_loss: 0,
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

router.get("/getUserPortfolios/:email", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.params.email });
    return res.status(200).json(user);
  } catch (e) {
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
      net_profit_loss: 0,
      stocks: [],
    });
    let portfolio = await user.save();
    return res.status(200).json(portfolio);
  } catch (e) {
    return res.status(500).json(e);
  }
});

router.post("/deletePortfolio", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    let index = -1;
    for (let i in user.portfolios) {
      if (user.portfolios[i]._id.toString() === req.body.portfolioId) {
        index = i;
      }
    }
    if (index === -1) {
      return res.status(400).json({ error: "Portfolio does not exist" });
    }
    user.portfolios.splice(index, 1);
    await user.save();
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

router.post("/addStockToPortfolio", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    // console.log(user);

    let stockIndex = -1;
    let portfolioIndex = -1;

    //Find portfolio and stock index
    for (let i in user.portfolios) {
      if (user.portfolios[i].name === req.body.portfolioName) {
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

    //If stock does not exists, create a lot array
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
    }//If stock already exists, add it to the lots list and update the average buying price
     else {
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

      //Calculate the average buying_price after adding the stock lot
      for (let unit of user.portfolios[portfolioIndex].stocks[stockIndex]
        .lots) {
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

router.post("/deleteStock", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    let stockIndex = -1;
    let portfolioIndex = -1;

    //Find portfolio and stock index
    for (let i in user.portfolios) {
      //console.log(user.portfolios[i].name);
      if (user.portfolios[i]._id.toString() === req.body.portfolioId) {
        //console.log(i);
        portfolioIndex = i;
        for (let j in user.portfolios[i].stocks) {
          //console.log(user.portfolios[i].stocks[j]);
          if (
            user.portfolios[i].stocks[j]._id.toString() === req.body.stockId
          ) {
            stockIndex = j;
          }
        }
      }
    }
    console.log(portfolioIndex, stockIndex);
    
    if (portfolioIndex === -1) {
      return res.status(400).json({ error: "Portfolio does not exist" });
    } else if (stockIndex === -1) {
      return res.status(400).json({ error: "Stock does not exist" });
    } else {
      //If Lot id is sent, delete that particular Lot alone
      if (req.body.lotId) {
        let lotIndex = -1;
        console.log(user.portfolios[portfolioIndex].stocks[stockIndex]);
        for (let i in user.portfolios[portfolioIndex].stocks[stockIndex].lots) {
          if (
            user.portfolios[portfolioIndex].stocks[stockIndex].lots[
              i
            ]._id.toString() === req.body.lotId
          ) {
            lotIndex = i;
          }
        }
        console.log(lotIndex);
        if (lotIndex === -1) {
          return res.status(400).json({ error: "Stock Lot does not exist" });
        } else {
          user.portfolios[portfolioIndex].stocks[stockIndex].lots.splice(
            lotIndex,
            1
          );
          let sum = 0;
          let numOfShares = 0;
            
          //Update the buying price and the stock count
          for (let unit of user.portfolios[portfolioIndex].stocks[stockIndex]
            .lots) {
            //console.log(unit);
            if (unit.price && unit.shares) {
              sum += unit.price * unit.shares;
              numOfShares += unit.shares;
              console.log(numOfShares, sum);
            }
          }
          // console.log("220: ", sum, numOfShares);
          if (sum === 0 && numOfShares === 0) {
            user.portfolios[portfolioIndex].stocks[
              stockIndex
            ].avg_buy_price = 0;
          } else {
            user.portfolios[portfolioIndex].stocks[stockIndex].avg_buy_price =
              Number(sum / numOfShares);
          }

          user.portfolios[portfolioIndex].stocks[stockIndex].no_of_shares =
            Number(numOfShares);
        }
      }
      //If Lot id not sent, delete the entire stock entry
      else {
        user.portfolios[portfolioIndex].stocks.splice(stockIndex, 1);
      }
    }
    await user.save();
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.post("/sellStock", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    let stockIndex = -1;
    let portfolioIndex = -1;
    for (let i in user.portfolios) {
      //console.log(user.portfolios[i].name);
      if (user.portfolios[i]._id.toString() === req.body.portfolioId) {
        //console.log(i);
        portfolioIndex = i;
        for (let j in user.portfolios[i].stocks) {
          console.log(user.portfolios[i].stocks[j]);
          if (
            user.portfolios[i].stocks[j]._id.toString() === req.body.stockId
          ) {
            stockIndex = j;
          }
        }
      }
    }
    console.log(portfolioIndex, stockIndex);
    if (portfolioIndex === -1) {
      return res.status(400).json({ error: "Portfolio does not exist" });
    } else if (stockIndex === -1) {
      return res.status(400).json({ error: "Stock does not exist" });
    } else {
      if (req.body.lotId) {
        lotIndex = -1;
        for (let i in user.portfolios[portfolioIndex].stocks[stockIndex].lots) {
          if (
            user.portfolios[portfolioIndex].stocks[stockIndex].lots[
              i
            ]._id.toString() === req.body.lotId
          ) {
            lotIndex = i;
          }
        }
        if (lotIndex === -1) {
          return res.status(400).json({ error: "Stock Lot does not exist" });
        } else {
          // console.log(
          //   user.portfolios[portfolioIndex].stocks[stockIndex].avg_buy_price,
          //   user.portfolios[portfolioIndex].stocks[stockIndex].lots[lotIndex]
          //     .shares,
          //   req.body.sellingPrice
          // );
          let profit_loss =
            (req.body.sellingPrice -
              user.portfolios[portfolioIndex].stocks[stockIndex]
                .avg_buy_price) *
            user.portfolios[portfolioIndex].stocks[stockIndex].lots[lotIndex]
              .shares;
          //console.log(profit_loss);

          user.portfolios[portfolioIndex].stocks[stockIndex].no_of_shares -=
            user.portfolios[portfolioIndex].stocks[stockIndex].lots[
              lotIndex
            ].shares;

          user.portfolios[portfolioIndex].stocks[stockIndex].lots.splice(
            lotIndex,
            1
          );
          user.portfolios[portfolioIndex].net_profit_loss +=
            Number(profit_loss);
          
          
        }
      } else {
        let profit_loss = 0;
        // console.log(
        //   user.portfolios[portfolioIndex].stocks[stockIndex].avg_buy_price,
        //   user.portfolios[portfolioIndex].stocks[stockIndex].no_of_shares,
        //   req.body.sellingPrice
        // );
        profit_loss =
          (req.body.sellingPrice -
            user.portfolios[portfolioIndex].stocks[stockIndex].avg_buy_price) *
          user.portfolios[portfolioIndex].stocks[stockIndex].no_of_shares;
        // console.log(profit_loss);
        user.portfolios[portfolioIndex].stocks.splice(stockIndex, 1);
        user.portfolios[portfolioIndex].net_profit_loss += Number(profit_loss);
      }
    }
    await user.save();
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
