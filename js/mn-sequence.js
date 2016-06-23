var EventEmitter = require('events').EventEmitter;
var util = require('util');

StepSequence = function()
{
  EventEmitter.call(this);
  this.content_ = [];
}

util.inherits(StepSequence, EventEmitter);

StepSequence.prototype.tick = function()
{
  if (this.content_.length > 0)
  {
    this.emit("tick", this.content_[0]);
    this.content_ = this.content_.rotate(1);
  }
}

StepSequence.prototype.setContent = function(content)
{
  this.content_ = content;
}

StepSequence.prototype.connect = function(target)
{
  if (target instanceof Function)
  {
    this.on("tick", target);
  }
  else
  {
    this.on("tick", function()
      {
        target.tick();
      });
  }
}
