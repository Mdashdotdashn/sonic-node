var assert = require("assert");

require("../js/theory/theory.js");

assert.equal(indexfromnotename("C"), 0);
assert.equal(indexfromnotename("Bb"), 10);
assert.equal(indexfromnotename("e#"), indexfromnotename("f"));

assert.equal(midinotefromname("C3"), 48);
assert.equal(midinotefromname("b3"), midinotefromname("cb4"));
assert.equal(midinotefromname("b#3"), midinotefromname("c4"));
