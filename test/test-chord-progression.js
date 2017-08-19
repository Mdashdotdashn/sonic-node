var assert = require("assert");

require("../js/progression/progression.js");
require("../js/sequencing/mn-beat-time-line.js");
require("../js/sequencing/mn-beat-time-position.js");
require("../js/theory/theory.js");
require("../js/mn-scale.js");

makeDegreeSequence = function(degreeList)
{
  var offset = convertToPosition("1.1.1", new Signature(), kTicksPerBeats);
  var position = offset;
  var degreeSequence = new Timeline();
  degreeList.forEach(function(degree)
  {
    degreeSequence.add(degree, position);
    position = addPositions(position, offset);
  })
  degreeSequence.setLength(position);
  return degreeSequence;
}

// Progression generation
// From int indexes
var sequence = makeDegreeSequence([1,6]);
var progression = makeChordProgression(buildScaleNotes("c3", "minor"), sequence);
assert.equal(chordname(progression.sequence[0].element), "Cm");
assert.equal(chordname(progression.sequence[1].element), "G#");

// From strings
var sequence = makeDegreeSequence(["1","6"]);
var progression = makeChordProgression(buildScaleNotes("c3", "minor"), sequence);
assert.equal(chordname(progression.sequence[0].element), "Cm");
assert.equal(chordname(progression.sequence[1].element), "G#");

// Using modifiers
var sequence = makeDegreeSequence(["1","5M"]);
var progression = makeChordProgression(buildScaleNotes("c3", "major"), sequence);
assert.equal(chordname(progression.sequence[0].element), "C");
assert.equal(chordname(progression.sequence[1].element), "G");

// There were a bugz
var sequence = makeDegreeSequence(["1"]);
var progression = makeChordProgression(buildScaleNotes("a3", "minor"), sequence);
assert.equal(chordname(progression.sequence[0].element), "Am");

//var sequence = makeDegreeSequence(["1"]);
//var progression = makeChordProgression("eb3", "minor", sequence);
//assert.equal(chordname(progression.sequence[0].element), "D#m");

// inversion

var chord = [40, 44, 47];
var expectedInversion = [40, 32, 35];
var result = invertChord(chord, -2);
assert.deepEqual(result, expectedInversion);
assert.deepEqual(invertChord(result,2), chord);

// Rectification

//var cp1 = makeChordProgression("a3", "major", [4,1]);
//rectify_progression(cp1, 1);
//var cp2 = makeChordProgression("a3", "major", [4,1]);
//rectify_progression(cp2, 3);
//assert.deepEqual(cp1, cp2);
