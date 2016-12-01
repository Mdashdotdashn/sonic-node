var EventEmitter = require('events').EventEmitter;
var util = require('util');

StepSequence = function(resolutionInSixteenth)
{
  EventEmitter.call(this);
  this.content_ = [];
  this.resolutionInSixteenth_ = resolutionInSixteenth;
  this.index_ = 0;
}

util.inherits(StepSequence, EventEmitter);

StepSequence.prototype.tick = function(position)
{
  var sixteenth = sixteenthCount(position);
  if (this.content_.length > 0 && position.ticks_ == 0 && (sixteenth % this.resolutionInSixteenth_ == 0))
  {
    var step = sixteenth / this.resolutionInSixteenth_;
    this.emit("tick", this.content_[step % this.content_.length]);
  }
}

StepSequence.prototype.setResolution = function(resolutionInSixteenth)
{
  this.resolutionInSixteenth_ = resolutionInSixteenth;
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
