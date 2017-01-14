var assert = require("assert");

require("../js/progression/progression.js");
require("../js/theory/theory.js");
require("../js/mn-scale.js");

// Progression generation

var sequence = [1,6];
var progression = makeChordProgression("c3", "minor", sequence);
assert.equal(progressionElementChordName(progression[0]), "Cm");
assert.equal(progressionElementChordName(progression[1]), "G#");

var sequence = ["1","6"];
var progression = makeChordProgression("c3", "minor", sequence);
assert.equal(progressionElementChordName(progression[0]), "Cm");
assert.equal(progressionElementChordName(progression[1]), "G#");

var sequence = ["1","5M"];
var progression = makeChordProgression("c3", "major", sequence);
assert.equal(progressionElementChordName(progression[0]), "C");
assert.equal(progressionElementChordName(progression[1]), "G");

var sequence = ["1"];
var progression = makeChordProgression("a3", "minor", sequence);
assert.equal(progressionElementChordName(progression[0]), "Am");

// Rectification

var cp1 = makeChordProgression("a3", "major", [4,1]);
rectify_progression(cp1, 1);
var cp2 = makeChordProgression("a3", "major", [4,1]);
rectify_progression(cp2, 3);
assert.deepEqual(cp1, cp2);
