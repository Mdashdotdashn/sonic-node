
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

Timeline.prototype.add = function(element, position)
{
  CHECK_TYPE(position, SequencingPosition);
  this.sequence.push({
    position: position,
    element: element,
  })
}

Timeline.prototype.setLength = function(length)
{
  CHECK_TYPE(length, SequencingPosition);
  this.length = length;
}

createTimeline = function(elements, positionOffset)
{
  CHECK_TYPE(positionOffset, SequencingPosition);
  var ticksPerBeat = positionOffset.ticksPerBeat_;

  var current = new SequencingPosition(ticksPerBeat);
  var timeline = new Timeline(ticksPerBeat);

  elements.forEach(function(element){
    timeline.add(element, current);
    current = addPositions(current, positionOffset);
  })

  return timeline;
}
