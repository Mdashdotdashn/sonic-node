
kTicksPerBeats = 24; // Equivalent to midi clock

//------------ Time signature ---------------------------

Signature = function()
{
  this.numerator = 4;
  this.denominator = 4;
}

//------------ Sequencing Position ---------------------------

SequencingPosition = function(ticksPerBeat)
{
  this.beats_ = 0;
  this.sixteenth_ = 0;
  this.ticks_ = 0;
  this.ticksPerBeat_ = ticksPerBeat;
}

createSequencingPosition = function(tickCount, ticksPerBeat)
{
  var position = new SequencingPosition(ticksPerBeat);
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

// converts a beat string ("1.1.3.2") to a sequencing position

convertToPosition = function(beatString, signature, ticksPerBeat)
{
  // Expects a dotted string (M.B.S.T) with
  // M = Measure
  // B = Beat
  // S = Sixteenth
  // T = ticks
  //
  // All values start at 1
  //
  // When using standard midi clock resolution T is the range  [1..6]

  var split = beatString.split(".");
  var position = new SequencingPosition(ticksPerBeat);
  position.ticks_ = split.length > 3 ? parseInt(split[3] - 1) : 0;
  position.sixteenth_ = split.length > 2 ? parseInt(split[2] - 1) : 0;
  position.beats_ = signature.numerator * parseInt(split[0] -1);
  if (split.length > 1)
  {
    position.beats_ += parseInt(split[1] - 1);
  }
  return position;
}
