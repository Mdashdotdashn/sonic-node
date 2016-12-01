var NanoTimer = require("nanotimer");
var EventEmitter = require('events').EventEmitter;
var util = require('util');


var STickHeartBeat = function(heartbeat)
{
  heartbeat.tick();
}

Heartbeat = function()
{
    this.tempo_ = 120;
    this.timer_ = new NanoTimer();
    this.clockTicksPerBeat_ = 24;
    this.tickCount_ = 0;
}

util.inherits(Heartbeat, EventEmitter);

Heartbeat.prototype.setTempo = function(tempo)
{
  this.tempo_ = tempo;
}

Heartbeat.prototype.run = function()
{
  var interval = '' + 60000./this.tempo_/this.clockTicksPerBeat_ +'m';
  this.tickCount_ = 0;
  this.timer_.setInterval(function(hb) 
    { hb.emit("tick", hb.tickCount_++);}, [this], interval);
}

Heartbeat.prototype.connect = function(target)
{
  if (target instanceof Function)
  {
    this.on("tick", target);
  }
  else
  {
    this.on("tick", function(tickCount)
      {
        target.tick(tickCount);
      });
  }
}

Heartbeat.prototype.ticksPerSixteenth = function()
{
  return this.clockTicksPerBeat_ / 4;
}
