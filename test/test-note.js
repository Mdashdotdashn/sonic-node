var assert = require("assert");

require("../js/theory/theory.js");

assert.equal(indexfromnotename("C"), 0);
assert.equal(indexfromnotename("Bb"), 10);
assert.equal(indexfromnotename("e#"), indexfromnotename("f"));
