require("./js/mn-sequence.js");
require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");
require("./js/mn-scale.js");
require("./js/mn-chordprogression.js");
require("./js/mn-note.js");
require("./js/mn-utils.js");

var rootNote = "c4"
var scale = "minor"
var progression = [1, 7 ,4, 6, 1, 3, 6, 6];


var device = MidiDevice.find("circuit");

var cp = new ChordProgression(rootNote, scale);
var sequence = new StepSequence();
var heartbeat = new Heartbeat();

var chordSequence = [];
progression.forEach(function(degree) {
  chordSequence.push(cp.chord(degree));
  });
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
        console.log(note);
        });
    }
  });

heartbeat.run();

