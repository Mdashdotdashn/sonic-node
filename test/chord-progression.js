var assert = require("assert");

require("../js/mn-chordprogression.js");

var cp1 = makeChordProgression("a3", "major", [4,1]);
rectify_progression(cp1, 1);
var cp2 = makeChordProgression("a3", "major", [4,1]);
rectify_progression(cp2, 3);
assert.deepEqual(cp1, cp2);
