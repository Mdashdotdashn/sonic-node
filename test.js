require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");
require("./js/mn-scale.js");
require("./js/mn-note.js");
require("./js/mn-utils.js");

var device = MidiDevice.find("circuit");

var arp = 
{
  notes_: [ 72, 75, 79 ],
  index_: 0,

  tick: function()
  {
    device.play(this.notes[this.index]);
    this.index = (this.index + 1) % this.notes.length;
  },

  setNotes(notes)
  {
    notes_ = notes;
  }
}


//var heartbeat = new Heartbeat();
//heartbeat.addTicker(arp);
//heartbeat.run();
console.log(notemap["c3"]);

