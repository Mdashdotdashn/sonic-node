var assert = require("assert");
require("../js/mn-utils.js");

transform = function(array, method, filterFunc)
{
  var filter = (filterFunc == undefined) ? function() { return true; } : filterFunc;
  array.forEach(function(element, index, theArray){
    if (filter(element))
    {
      theArray[index] = method(element);
    }
  });
}


var test = [1,2,3,5];
transform(test, function(i) { return i+=1;}, function(i) { return i%2 == 1;});
var expected = [2,2,4,6];

assert.deepEqual(test,expected);
