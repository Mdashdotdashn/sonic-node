var assert = require("assert");

require("../js/theory/mn-chords.js");
require("../js/mn-note.js");
require("../js/mn-scale.js");

var chordList = ["cm", "a#", "fm", "g#"];
var result = scalesFromChords(chordList);

assert.equal(result.score_, 1);
assert.equal(result.scaleList_.length, 1);
assert.equal(result.scaleList_[0], "C minor");
