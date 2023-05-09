const mongoose = require("mongoose");
const { Schema } = mongoose;

const lotsSchema = new Schema({
    shares: Number,
    price: Number,
    date: Date
})

const StocksSchema = new Schema(
    {
        name: String,
        symbol: String,
        no_of_shares: Number,
        avg_buy_price: Number,
        lots: [lotsSchema]
    }
);

const PortfolioSchema = new Schema(
    {
        name: String,
        net_profit_loss: Number,
        stocks: [StocksSchema]
    }
);

const UserSchema = new Schema(
  {
    name: String,
    username: String,
    email: String,
    type: String,
    photoUrl: String,
    about: String,
    portfolios: [PortfolioSchema]

  }
);

module.exports = mongoose.model("users", UserSchema);
