var EventEmitter = require('events').EventEmitter;
var util = require('util');

StepSequence = function(resolutionInSixteenth)
{
  EventEmitter.call(this);
  this.content_ = [];
  this.modulo_ = 6 * resolutionInSixteenth;
  this.index_ = 0;
}

util.inherits(StepSequence, EventEmitter);

StepSequence.prototype.tick = function(tickCount)
{
  if (this.content_.length > 0 && tickCount % this.modulo_ == 0)
  {
    this.emit("tick", this.content_[this.index_]);
    this.index_ = (this.index_ + 1) % this.content_.length;
  }
}

StepSequence.prototype.setResolution = function(resolutionInSixteenth)
{
  this.modulo_ = 6 * resolutionInSixteenth;
}

StepSequence.prototype.setContent = function(content)
{
  this.content_ = content;
  if (this.content_.length > 0)
  {
    this.index_ = (this.index_ % this.content_.length);
  }
}

StepSequence.prototype.getContent = function()
{
  return this.content_;
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
