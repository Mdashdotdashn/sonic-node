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

  // transform it to a harmonic timeline
  var beatsPerBar = ticksPerBeat * signature.numerator;
  var harmonicTimeline = createTimeline(chords, createSequencingPosition(beatsPerBar, ticksPerBeat));

  // render the combination

  var rendered = renderSequence(harmonicTimeline, baseSequence, signature, ticksPerBeat);

  // Test against expected

  var expectedTimeline = new Timeline();

  expected.sequence.forEach(function(element)
  {
    var position = convertToPosition(element.position, signature, ticksPerBeat)
    var notes = element.notes.map(function(pitch)
    {
      return new NoteData(pitch, 1, 12);
    })
    expectedTimeline.add(notes, position);
  });
  expectedTimeline.setLength(convertToPosition(expected.length, signature, ticksPerBeat));

//  console.log(">>>" + JSON.stringify(rendered,null ,2));
//  console.log("<<<" + JSON.stringify(expectedTimeline,null ,2));
  assert.deepEqual(rendered.length,expectedTimeline.length);
  assert.deepEqual(rendered.sequence.length,expectedTimeline.sequence.length);
  for (var i = 0; i < rendered.sequence.length; i++)
  {
    assert.deepEqual(rendered.sequence[i],expectedTimeline.sequence[i]);
  }
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
