var EventEmitter = require('events').EventEmitter;
var util = require('util');

EventSequence = function()
{
  this.eventList_ = [];
  this.sequenceLength_ = 0;
}

util.inherits(EventSequence, EventEmitter);

// expects array of
// {
//   position: { beat: ; sixteenth: ; ticks: }
//   value: anything
// }

EventSequence.prototype.setContent = function(eventList, sequenceLengthInBars)
{
  this.eventList_ = eventList;
  this.sequenceLength_ = sequenceLengthInBars * 4;
}

EventSequence.prototype.tick = function(position)
{
  var needle = position;
  needle.beats_ = position.beats_ % this.sequenceLength_;
  var emitter = this;

  this.eventList_.forEach(function(e)
  {
      if ((e.position.beats_ == needle.beats_)
        &&(e.position.sixteenth_ == needle.sixteenth_)
        &&(e.position.ticks_ == needle.ticks_))
        {
          emitter.emit("tick", e.value);
        }
  });
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
        target.tick(noteList);
      });
  }
}
