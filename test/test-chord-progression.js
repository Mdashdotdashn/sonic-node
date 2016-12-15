var assert = require("assert");

require("../js/progression/progression.js");
require("../js/theory/theory.js");
require("../js/mn-scale.js");
// Progression generation

var sequence = [1,6];
var progression = makeChordProgression("c3", "minor", sequence);
assert.equal(chordname(progression[0].notes), "cm");
assert.equal(chordname(progression[1].notes), "g#");

var sequence = ["1","6"];
var progression = makeChordProgression("c3", "minor", sequence);
assert.equal(chordname(progression[0].notes), "cm");
assert.equal(chordname(progression[1].notes), "g#");

var sequence = ["1","5M"];
var progression = makeChordProgression("c3", "major", sequence);
assert.equal(chordname(progression[0].notes), "c");
assert.equal(chordname(progression[1].notes), "g");

// Rectification

var cp1 = makeChordProgression("a3", "major", [4,1]);
rectify_progression(cp1, 1);
var cp2 = makeChordProgression("a3", "major", [4,1]);
rectify_progression(cp2, 3);
assert.deepEqual(cp1, cp2);
