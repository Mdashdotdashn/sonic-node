_ = require("lodash");

STLegato = function()
{
  this.amount = 70;
}

STLegato.prototype.setParameters = function(parameters)
{
  _.extend(this,parameters);
}

STLegato.prototype.process = function(timeline, transformation)
{
  // Generate a sorted array of the note's position in ticks
  var sequenceInTicks = _.sortBy(
    timeline.sequence.map(function(item){
      return {
        position: ticksFromPosition(item.position),
        element: item.element
      }
    })
    , 'position');

  var timestampInTicks = sequenceInTicks.reduce(function(set, item){
    set.add(item.position);
    return set;
  }, new Set());
  timestampInTicks.add(ticksFromPosition(timeline.length));

  // Build a map from position to length

  var positionArray = Array.from(timestampInTicks);
  var lengthMap = new Object;
  for (var i = 0; i < positionArray.length - 1; i++)
  {
    var length = Math.floor((positionArray[i+1] - positionArray[i]) * (this.amount / 100));
    lengthMap[positionArray[i]] = Math.max(length,1);
  }

  newTimeline = new Timeline();
  newTimeline.sequence = timeline.sequence.map(function(item)
  {
    var position = item.position;
    var noteData = item.element;

    CHECK_TYPE(position, SequencingPosition);
    CHECK_TYPE(noteData, NoteData);

    var newLength = lengthMap[ticksFromPosition(position)];
    noteData.length = newLength;
    return {
      position: position,
      element: noteData
    }
  })
  newTimeline.setLength(timeline.length);
  return newTimeline;
}

//------------------------------------------------------------------------------
SequenceTransformationStack = function()
{
  this.reset();
}

SequenceTransformationStack.prototype.reset = function()
{
  this.stack_ = [];
}

SequenceTransformationStack.prototype.add = function(transformation)
{
  this.stack_.push(transformation);
}

SequenceTransformationStack.prototype.process = function(timeline)
{
  return this.stack_.reduce(function(timeline, transformation)
  {
    lo(transformation);
    return transformation.process(timeline);
  }, timeline);
}
