require("./js/mn-sequence.js");
require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");
require("./js/mn-scale.js");
require("./js/mn-chordprogression.js");
require("./js/mn-note.js");
require("./js/mn-utils.js");

{
var rootNote = "c4"
var scale = "major"
var progression = [1, 5 ,4 , 1];
}

var rootNote = "c4"
var scale = "minor"
var progression = [1, 7 ,4 , 6, 1, 3, 6, 6];

var analyseProgression = function(sequence)
{
  console.log("chord sequence = " + JSON.stringify(sequence));
  console.log("analysing distances");

  var sum = 0;

  for (var index = 0; index < sequence.length; index++)
  {
    var next = index < sequence.length -1 ? index + 1 : 0;
    var distance = chordSequence[next].distanceFrom(chordSequence[index]);
    console.log(index + "->" + next + ":" + distance);
    sum += Math.abs(distance);
  }

  console.log("entropy = " + sum);
}

var device = MidiDevice.find("circuit");

var cp = new ChordProgression(rootNote, scale);
var sequence = new StepSequence();
var heartbeat = new Heartbeat();

var chordSequence = [];
progression.forEach(function(degree) {
  chordSequence.push(cp.chord(degree));
  });

analyseProgression(chordSequence);

/*
sequence.setContent(chordSequence);

heartbeat.connect(sequence);

  sequence.connect(function(step)
  {
    if (device)
    {
      step.forEach(function(note) {
        device.play(note);
        });
    }
    else
    {
      step.forEach(function(note) {
        console.log(notename(note) + "(" + note + ")");
        });
    }
  });

heartbeat.run();
*/
