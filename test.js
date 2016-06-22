require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");
require("./js/mn-scale.js");
require("./js/mn-note.js");
require("./js/mn-utils.js");

var device = MidiDevice.find("circuit");

var sequence = 
{
  notes_: scale("a3", "minor"),

  tick: function()
  {
    console.log(notename(this.notes_[0]));
    //device.play(this.notes_[0]);
    this.notes_ = this.notes_.rotate(1);
  },

  setNotes(notes)
  {
    notes_ = notes;
  }
}

var heartbeat = new Heartbeat();
heartbeat.addTicker(sequence);
heartbeat.run();

