const { connectToDb, getData, getFilteredData } = require("./db");

var ex = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");


var app = ex();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/fetch", async (req, res) => {
  var data = await getData();
  console.log('sent')
  return res.send(data);
});

// {
//   end_year: [],
//   sector: [],
//   pestle: [ 'Economic', 'Industries', 'Environmental' ],
//   source: [ 'SBWire' ],
//   region: [ ],
//   topics: []
// }

// [[{"pestle":"Economic"},{"pestle":"Industries"},{"pestle":"Environmental"}],[{"source":'SBWire'}]]
app.post("/filterdata",async(req,res) =>{
  var req_body = req.body
  var query = []
  var obj_keys = Object.keys(req_body)
  for(var key of obj_keys){
    var subarrray = []
    if(req_body[key].length !== 0){
      for(var value of req_body[key]){
        
        var obj = {}
        if (parseInt(value)){
          
          obj[key] = parseInt(value)
        }
        else{
          obj[key] = value
        }
        subarrray.push(obj)
      }
      if(subarrray.length !== 0){
        query.push(subarrray)
      }
    }
  }
  console.log("query",query)
    var data =await getFilteredData(query)
 
  // console.log(data)
  console.log('sent filter')
  return res.send(data);

})

app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
