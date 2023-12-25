var obj = { A: [1, 2, 34], B: [], C: ["456", "poiiuyyyy"] };
var result = [];
var obj_arr = Object.keys(obj);
for (var key of obj_arr) {
    var sub = [];
  if (obj[key].length !== 0) {
    for (var value of obj[key]) {
      
      var obj1 = {};
      if (parseInt(value)) {
        obj1[key] = parseInt(value);
      } else {
        obj1[key] = value;
      }
      sub.push(obj1);
      console.log("234", sub);
    }
    if (sub.length !== 0) {
      result.push(sub);
    }
  }
}
console.log("123", result);
//   $and: [
//     {
//         $or: [
//             {"pestle": "john"},
//             {"pestle": "john"}
//         ]
//     },
//     $or: [
//             {"sector": "john"},
//             {"sector": "john"}
//         ]
//     },
// ]

var orQuery = []

for(var value of result){
    var obj = {$or : value}
    orQuery.push(obj)
}
console.log(JSON.stringify(orQuery))