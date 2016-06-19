require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");

var device = MidiDevice.find("circuit");

var arp = 
{
  notes: [ 72, 75, 79 ],
  index: 0,

  tick: function()
  {
    device.play(this.notes[this.index]);
    this.index = (this.index + 1) % this.notes.length;
  }
}


var heartbeat = new Heartbeat();
heartbeat.addTicker(arp);
heartbeat.run();

