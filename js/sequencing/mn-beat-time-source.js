require("./mn-heartbeat.js")
require("./mn-sequencing-position.js")

var EventEmitter = require('events').EventEmitter;
var util = require('util');

BeatTimeSource = function(ticksPerBeat)
{
  this.ticksPerBeat_ = ticksPerBeat;
}

util.inherits(BeatTimeSource, EventEmitter);

BeatTimeSource.prototype.connect = function(target)
{
  if (target instanceof Function)
  {
    this.on("tick", target);
  }
  else
  {
    this.on("tick", function(position)
      {
        target.tick(position);
      });
  }
}

BeatTimeSource.prototype.tick = function(tickCount)
{
  var position = createSequencingPosition(tickCount, this.ticksPerBeat_);
  this.emit("tick", position);
}
