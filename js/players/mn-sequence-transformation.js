STLegato = function(parameters)
{
}

STLegato.prototype.process = function(timeline, transformation)
{
  newTimeline = new Timeline();
  newTimeline.sequence = timeline.sequence.map(function(item)
  {
    var position = item.position;
    var noteData = item.element;

    CHECK_TYPE(position, SequencingPosition);
    CHECK_TYPE(noteData, NoteData);

    noteData.length = 36;
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

SequenceTransformationStack.prototype.process = function(timeline)
{
  return this.stack_.reduce(function(timeline, transformation)
  {
    return transformation(timeline);
  }, timeline);
}
