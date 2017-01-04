var assert = require("assert");
require("../js/mn-utils.js");

transform = function(array, method, filter)
{
  return array.map(function(element)
  {
    return (!filter) || filter(element) ? method(element): element;
  });
}

let isEven = (x) => x%2 == 1;
let inc = (x) => x + 1;

var test = [1,2,3,5];
var result = transform(test,inc, isEven);
var expected = [2,2,4,6];
assert.deepEqual(result, expected);

var result = transform(test,inc);
var expected = [2,3,4,6];
assert.deepEqual(result, expected);
