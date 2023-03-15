//Here you will require route files and export the constructor method as shown in lecture code and worked in previous labs.
const routesAPI = require("./routesAPI");

const constructorMethod = (app) => {
  app.use("/", routesAPI);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
