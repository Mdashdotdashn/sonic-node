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

  // convert base sequence to timeline

  sequenceTimeline = new Timeline();
  sequenceTimeline.sequence = baseSequence.sequence.map(function(element)
  {
    var position = convertToPosition(element.position, signature, ticksPerBeat);
    return { position: position, element: element.degrees };
  });

  sequenceTimeline.setLength(convertToPosition(baseSequence.length, signature, ticksPerBeat));
  // convert harmonic progression to timeline

  var beatsPerBar = ticksPerBeat * signature.numerator;
  var degreeTimeline = createTimeline(progression.degrees, createSequencingPosition(beatsPerBar, ticksPerBeat));
  var harmonicTimeline = makeChordProgression(progression.root, progression.scale, degreeTimeline);

  // render
  var rendered = renderSequence(harmonicTimeline, sequenceTimeline, signature, ticksPerBeat);

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

  assert.deepEqual(rendered.length,expectedTimeline.length);
  assert.deepEqual(rendered.sequence.length,expectedTimeline.sequence.length);
  for (var i = 0; i < rendered.sequence.length; i++)
  {
    assert.deepEqual(rendered.sequence.length,expectedTimeline.sequence.length);
    var actual = _.sortBy(rendered.sequence[i].element, 'pitch');
    var expected = _.sortBy(expectedTimeline.sequence[i].element, 'pitch');
    assert.deepEqual(actual, expected);
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
    degrees: [1,"b5"]
}

var expected = {
  length: "3.1.1",
  sequence:
    [
      { position: "1.1.1", notes: [36, 48, 52]},
      { position: "1.2.1", notes: [52]},
      { position: "1.3.1", notes: [55, 48]},
      { position: "1.4.1", notes: [36, 48, 52]},
      { position: "2.1.1", notes: [42, 54, 58]},
      { position: "2.2.1", notes: [58]},
      { position: "2.3.1", notes: [61, 54]},
      { position: "2.4.1", notes: [42, 54, 58]},
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
      { position: "2.1.1", notes: [42, 54, 58]},
      { position: "2.2.1", notes: [58]},
      { position: "2.3.1", notes: [61, 54]},
    ]
}

testSequenceRendering(signature, baseSequence, progression, expectedOn3_4);
