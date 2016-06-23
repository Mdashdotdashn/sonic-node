require("./js/mn-sequence.js");
require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");
require("./js/mn-scale.js");
require("./js/mn-note.js");
require("./js/mn-utils.js");

var device = MidiDevice.find("circuit");

var sequence = new StepSequence();
sequence.setContent(scale("a3", "minor"));

var heartbeat = new Heartbeat();

heartbeat.on("tick", function()
  {
    sequence.tick();
  });

sequence.on("tick", function(step)
  {
    if (device)
    {
      device.play(step);
    }
    else
    {
      console.log(step);
    }
  });

heartbeat.run();

