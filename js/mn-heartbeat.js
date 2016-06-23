var NanoTimer = require("nanotimer");
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var STickHeartBeat = function(heartbeat)
{
  heartbeat.tick();
}

Heartbeat = function()
{
    this.tempo = 140;
    this.timer = new NanoTimer();
}

util.inherits(Heartbeat, EventEmitter);

Heartbeat.prototype.run = function()
{
  this.timer.setInterval(function(hb) { hb.emit("tick")	;}, [this], '2s');        	
}
