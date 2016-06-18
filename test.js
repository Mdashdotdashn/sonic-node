var sleep_mod = require("sleep");
require("./js/mn-midi-device.js");

sleep = function(sec)
{
  sleep_mod.usleep(1000000 * sec);
}



var device = MidiDevice.find("circuit");

var arp = [ 72, 75, 79 ];
var index = 0;

while (true)
{
  device.play(arp[index]);
  index = (index + 1) % arp.length;
  sleep(0.5);
}

