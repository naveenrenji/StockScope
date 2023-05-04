//Here you will require route files and export the constructor method as shown in lecture code and worked in previous labs.
const stockAPI = require("./stockAPI");
const finnHubStockAPI = require('./finnHubStockAPI');
const yahooFinAPI = require('./yahooFinanceAPI')
const userRoutes = require('./users')

const constructorMethod = (app) => {
  app.use("/stock", stockAPI);
  app.use("/chart",finnHubStockAPI);
  app.use("/screener", yahooFinAPI);
  app.use("/users", userRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
