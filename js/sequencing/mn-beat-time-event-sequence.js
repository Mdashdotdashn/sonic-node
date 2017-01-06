var EventEmitter = require('events').EventEmitter;
var util = require('util');

EventSequence = function()
{
  this.timeline_ = undefined;
}

util.inherits(EventSequence, EventEmitter);

// expects array of
// {
//   position: { beat: ; sixteenth: ; ticks: }
//   value: anything
// }

EventSequence.prototype.setContent = function(timeline)
{
  CHECK_TYPE(timeline, Timeline);

  this.timeline_ = timeline;
}

EventSequence.prototype.tick = function(position)
{
  if (this.timeline_)
  {
    var needle = moduloPosition(position, this.timeline_.length);
    var emitter = this;

    this.timeline_.sequence.forEach(function(e)
    {
        if ((e.position.beats_ == needle.beats_)
          &&(e.position.sixteenth_ == needle.sixteenth_)
          &&(e.position.ticks_ == needle.ticks_))
          {
            emitter.emit("tick", e.element);
          }
    });
  }
}

EventSequence.prototype.connect = function(target)
{
  if (target instanceof Function)
  {
    this.on("tick", target);
  }
  else
  {
    this.on("tick", function(noteList)
      {
        target.onEvent(noteList);
      });
  }
}
