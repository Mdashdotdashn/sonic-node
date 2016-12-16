
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


//------------ Time line ---------------------------

Timeline = function(ticksPerBeat)
{
  this.length = new SequencingPosition(ticksPerBeat);
  this.sequence = [];
}

Timeline.prototype.add = function(element, position,  duration)
{
  CHECK_TYPE(position, SequencingPosition);
  CHECK_TYPE(duration, SequencingPosition);
  this.sequence.push({
    position: position,
    element: element,
    duration: duration
  })

  var elementEnd = addPositions(position,duration);
  this.length = maxPositions(this.length, elementEnd);
}

Timeline.prototype.setLength = function(length)
{
  CHECK_TYPE(position, length);
  this.length = length;
}

createTimeline = function(elements, positionOffset)
{
  CHECK_TYPE(positionOffset, SequencingPosition);
  var ticksPerBeat = positionOffset.ticksPerBeat_;

  var current = new SequencingPosition(ticksPerBeat);
  var timeline = new Timeline(ticksPerBeat);

  elements.forEach(function(element){
    timeline.add(element, current, positionOffset);
    current = addPositions(current, positionOffset);
  })

  return timeline;
}
