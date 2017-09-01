require("../js/players/players.js");
require("../js/sequencing/sequencing.js");
require("../js/progression/progression.js");
require("../js/theory/theory.js");
require("../js/midi/midi.js");

var assert = require("assert");

function testSequenceRendering(signature, baseSequence, progression, expected)
{
  CHECK_TYPE(baseSequence, Timeline);

  var ticksPerBeat = kTicksPerBeats;

  // convert base sequence to proper position

  sequenceTimeline = baseSequence.mapSteps(
     (element) => element,
     (position) => convertToPosition(position, signature, ticksPerBeat)
  );

  // Create degree time line

  var beatsPerBar = ticksPerBeat * signature.numerator;
  var degreeTimeline = createTimeline(progression.degrees, createSequencingPosition(beatsPerBar, ticksPerBeat));

  // convert harmonic progression to timeline

  var scaleIntervals = buildScaleIntervals(progression.scale);
  var harmonicTimeline = buildChordProgression(degreeTimeline, scaleIntervals);

  // render
  var rendered = renderSequence(progression.root, harmonicTimeline, sequenceTimeline, signature, ticksPerBeat);

  // Test against expected

  var expectedTimeline = expected.mapSteps(
    (element) => element.map((pitch) => new NoteData(pitch, 1, 12)),
    (position) => convertToPosition(position, signature, ticksPerBeat)
  );

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

var baseSequence = new Timeline ({
    length : "1.4.1",
    sequence:
      [
        { position: "1.1.1", element: [{d:1, t:-12}, 1,2]},
        { position: "1.2.1", element: [2]},
        { position: "1.3.1", element: [3,1]},
      ]
    });

var progression = {
    root: "c3",
    scale: "major",
    degrees: [1,"b5"]
}

var expected = new Timeline({
  length: "3.1.1",
  sequence:
    [
      { position: "1.1.1", element: [36, 48, 52]},
      { position: "1.2.1", element: [52]},
      { position: "1.3.1", element: [55, 48]},
      { position: "1.4.1", element: [36, 48, 52]},
      { position: "2.1.1", element: [42, 54, 58]},
      { position: "2.2.1", element: [58]},
      { position: "2.3.1", element: [61, 54]},
      { position: "2.4.1", element: [42, 54, 58]},
    ]
});

var signature = new Signature;
testSequenceRendering(signature, baseSequence, progression, expected);

signature.numerator = 3;
var expectedOn3_4 = new Timeline({
  length: "3.1.1",
  sequence:
    [
      { position: "1.1.1", element: [36, 48, 52]},
      { position: "1.2.1", element: [52]},
      { position: "1.3.1", element: [55, 48]},
      { position: "2.1.1", element: [42, 54, 58]},
      { position: "2.2.1", element: [58]},
      { position: "2.3.1", element: [61, 54]},
    ]
});

testSequenceRendering(signature, baseSequence, progression, expectedOn3_4);
