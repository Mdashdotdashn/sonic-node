
var SequencingPostion = function(ticksPerBeat)
{
  this.beats_ = 0;
  this.sixteenth_ = 0;
  this.ticks_ = 0;
  this.ticksPerBeat_ = ticksPerBeat;
}

createSequencingPosition = function(tickCount, ticksPerBeat)
{
  var position = new SequencingPostion(ticksPerBeat);
  position.beats_ = Math.floor(tickCount / ticksPerBeat);
  var remainder = tickCount % ticksPerBeat;
  var ticksPerSixteenth = ticksPerBeat / 4;
  position.ticks_ = remainder % ticksPerSixteenth;
  position.sixteenth_ = (remainder - position.ticks_) / ticksPerSixteenth;
  return position;
}

sixteenthCount = function(position)
{
  return position.sixteenth_ + 4 * position.beats_;
}
