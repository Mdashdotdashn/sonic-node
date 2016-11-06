var assert = require("assert");

require("../js/mn-chordprogression.js");

// Progression generation

var sequence = [1,6];
var progression = makeChordProgression("c3", "minor", sequence);
assert.equal(chordname(progression[0].notes_), "cm");
assert.equal(chordname(progression[1].notes_), "g#");

var sequence = ["1","6"];
var progression = makeChordProgression("c3", "minor", sequence);
assert.equal(chordname(progression[0].notes_), "cm");
assert.equal(chordname(progression[1].notes_), "g#");

var sequence = ["1","5M"];
var progression = makeChordProgression("c3", "major", sequence);
assert.equal(chordname(progression[0].notes_), "c");
assert.equal(chordname(progression[1].notes_), "g");

// Rectification

var cp1 = makeChordProgression("a3", "major", [4,1]);
rectify_progression(cp1, 1);
var cp2 = makeChordProgression("a3", "major", [4,1]);
rectify_progression(cp2, 3);
assert.deepEqual(cp1, cp2);
