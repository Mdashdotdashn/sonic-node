require("../js/players/players.js");
require("../js/sequencing/sequencing.js");
require("../js/progression/progression.js");
require("../js/theory/theory.js");
require("../js/midi/midi.js");
require("../js/mn-scale.js");

var assert = require("assert");

function testSequenceRendering(signature, baseSequence, progression, expected)
{
  var ticksPerBeat = kTicksPerBeats;

  // Build the basic chord structure

  var chords = makeChordProgression(progression.root, progression.scale, progression.degrees);
  rectify_progression(chords, 0);

  var harmonicStructure = createTimeline(chords, createSequencingPosition(ticksPerBeat * signature.numerator, ticksPerBeat));
  var length = createSequencingPosition(chords.length * ticksPerBeat * signature.numerator, ticksPerBeat);
  harmonicStructure.setLength(length);
  // render the combination

  var rendered = renderSequence(harmonicStructure, baseSequence, signature, ticksPerBeat);

  // Test against expected

  expected.length = convertToPosition(expected.length, signature, ticksPerBeat)
  expected.sequence.forEach(function(element)
  {
    element.position = convertToPosition(element.position, signature, ticksPerBeat)
    var notes = [];
    element.notes.forEach(function(pitch)
    {
      notes.push(new NoteData(pitch, 1, 12));
    })
    element.notes = notes;
  });
//  console.log(">>>" + JSON.stringify(rendered,null ,2));
//  console.log("<<<" + JSON.stringify(expected,null ,2));
  assert.deepEqual(rendered, expected);
}

//==============================================================================

var baseSequence = {
    length : "1.4.1",
    sequence:
      [
        { position: "1.1.1", degrees: [{d:1, t:-12}, 1,2]},
        { position: "1.2.1", degrees: [2]},
        { position: "1.3.1", degrees: [3,1]},
      ]
    }

var progression = {
    root: "c3",
    scale: "major",
    degrees: [1,5]
}

var expected = {
  length: "3.1.1",
  sequence:
    [
      { position: "1.1.1", notes: [36, 48, 52]},
      { position: "1.2.1", notes: [52]},
      { position: "1.3.1", notes: [55, 48]},
      { position: "1.4.1", notes: [36, 48, 52]},
      { position: "2.1.1", notes: [43, 55, 59]},
      { position: "2.2.1", notes: [59]},
      { position: "2.3.1", notes: [62, 55]},
      { position: "2.4.1", notes: [43, 55, 59]},
    ]
}

var signature = new Signature;
testSequenceRendering(signature, baseSequence, progression, expected);

signature.numerator = 3;
var expectedOn3_4 = {
  length: "3.1.1",
  sequence:
    [
      { position: "1.1.1", notes: [36, 48, 52]},
      { position: "1.2.1", notes: [52]},
      { position: "1.3.1", notes: [55, 48]},
      { position: "2.1.1", notes: [43, 55, 59]},
      { position: "2.2.1", notes: [59]},
      { position: "2.3.1", notes: [62, 55]},
    ]
}

testSequenceRendering(signature, baseSequence, progression, expectedOn3_4);
