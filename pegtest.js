var peg = require("pegjs");
var fs = require('fs');

var input ="chord {1 , {2,4,7}x2,  3 }";
var result;

fs.readFile( __dirname + '/grammar.txt', function (err, data) {
  if (err) {
    throw err; 
  }
  var parser = peg.buildParser(data.toString());

  result = parser.parse(input); // returns ["a", "b", "b", "a"]
  console.log(result);
});


