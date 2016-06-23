require("./js/mn-sequence.js");
require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");
require("./js/mn-scale.js");
require("./js/mn-note.js");
require("./js/mn-utils.js");

var device = MidiDevice.find("circuit");

var sequence = new StepSequence();
console.log(sequence);
sequence.setContent(scale("a3", "minor"));
sequence.on("tick", function(step)
  {
    if (device)
    {
      device.play(this.notes_[0]);
    }
    else
    {
      console.log(step);
    }
  });
var heartbeat = new Heartbeat();
heartbeat.addTicker(sequence);
heartbeat.run();

