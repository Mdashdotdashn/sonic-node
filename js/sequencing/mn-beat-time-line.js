
kTicksPerBeats = 24; // Equivalent to midi clock

CHECK_TYPE = function(value, expectedType)
{
  var objectType = typeof value;
  var valid = (objectType === "object") ? (value instanceof expectedType) : (objectType === expectedType);
  if (!valid)
  {
    console.log("while checking ");
    throw TypeError("Expecting a " + expectedType + " but got " + JSON.stringify(value));
  }
  return true;
}

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

ticksFromPosition = function(position)
{
  CHECK_TYPE(position, SequencingPosition);
  var tickCount = position.beats_;
  tickCount = 4 * tickCount + position.sixteenth_;
  tickCount = tickCount * (position.ticksPerBeat_ / 4) + position.ticks_;
  return tickCount;
}

comparePositions = function(pos1, pos2)
{
  var ticks1 = ticksFromPosition(pos1);
  var ticks2 = ticksFromPosition(pos2);
  if (ticks1 == ticks2) return 0;
  return ticks1 < ticks2 ? -1 : 1;
}

addPositions = function(pos1, pos2)
{
  var ticks1 = ticksFromPosition(pos1);
  var ticks2 = ticksFromPosition(pos2);
  return createSequencingPosition(ticks1 + ticks2, pos1.ticksPerBeat_);
}

moduloPosition = function(pos1, pos2)
{
  var ticks1 = ticksFromPosition(pos1);
  var ticks2 = ticksFromPosition(pos2);
  return createSequencingPosition(ticks1 % ticks2, pos1.ticksPerBeat_);
}

subPositions = function(pos1, pos2)
{
  var ticks1 = ticksFromPosition(pos1);
  var ticks2 = ticksFromPosition(pos2);
  return createSequencingPosition(ticks1 - ticks2, pos1.ticksPerBeat_);
}

sixteenthCount = function(position)
{
  return position.sixteenth_ + 4 * position.beats_;
}


stringPositionToTicks = function(position, signature, ticksPerBeat)
{
  CHECK_TYPE(position, "string");
  var elementPosition = convertToPosition(position, signature, ticksPerBeat);
  var elementPositionInTicks = ticksFromPosition(elementPosition);
  return elementPositionInTicks;
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
