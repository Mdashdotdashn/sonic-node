var assert = require("assert");

require("../js/progression/progression.js");
require("../js/sequencing/mn-beat-time-line.js");
require("../js/sequencing/mn-beat-time-position.js");
require("../js/theory/theory.js");


makeDegreeSequence = function(degreeList)
{
  var offset = convertToPosition("1.1.1", new Signature(), kTicksPerBeats);
  return createTimeline(degreeList, offset);
}

testChordProgression = function(rootNote, scale, degreeList,expectedChords)
{
//  console.log(rootNote + " " + scale + ":" + degreeList + ">" + expectedChords);
  var sequence = makeDegreeSequence(degreeList);
  var progression = buildChordProgression(sequence, buildScaleIntervals(scale));
  progression.sequence.forEach(function(step, index)
  {
    var chords = (tonal.chord.detect(tonal.harmonize(step.element, rootNote)));
    assert.ok(chords.indexOf(expectedChords[index]) >=0);
  })
}

// Progression generation
// From int indexes

testChordProgression("c", "minor", ["1","6"], ["Cm","AbM"]);
testChordProgression("c", "major", ["1","5M"], ["CM","GM"]);
testChordProgression("c", "major", ["1","5m"], ["CM","Gm"]);
testChordProgression("a", "minor", ["1"], ["Am"]);
testChordProgression("c", "major", ["1","b5"], ["CM","F#M"]);

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
