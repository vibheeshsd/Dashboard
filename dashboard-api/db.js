const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connectToDb: () => {
    return MongoClient.connect("mongodb://localhost:27017")
      .then((client) => {
        dbConnection = client.db("dashboard");
      })
      .catch((err) => {
        throw err;
      });
  },
  getData: async () => {
    await module.exports.connectToDb();
    var result = await dbConnection.collection("jsondata").find().toArray();
    return result;
  },
  getFilteredData:async (query)=>{
    var oQuery = []
    for (var subquery of query){
      var obj = {$or : subquery}
      oQuery.push(obj)
    }
    console.log(JSON.stringify(oQuery))
    await module.exports.connectToDb();
    var result = await dbConnection.collection("jsondata").find({$and:oQuery}).toArray();
    return result;
  }
};
