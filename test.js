
require("./js/mn-midi.js");
require("./js/mn-note.js");
require("./js/mn-midi-device.js");

//console.log(JSON.stringify(Notes));

var device = MidiDevice.find("circuit");
var output = device.outputs[0];
output.sendMessage(SMakeNoteOn(70, 127, 0));
output.sendMessage(SMakeNoteOff(70, 0));

