const MongoClient = require("mongodb").MongoClient;
const {mongoConfig} = require("./settings");

let _connection = undefined;
let _db = undefined;

module.exports = {
  dbConnection: async () => {
    const client = new MongoClient(mongoConfig.serverUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    if (!_connection) {
      _connection = await client.connect();
      _db = await client.db(mongoConfig.database);
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
};
