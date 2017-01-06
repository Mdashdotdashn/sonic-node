_ = require("lodash");

var ProcessStack = function()
{}

ProcessStack.prototype.process = function(timeline)
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
  lo(newTimeline);
  return newTimeline;
}

SequencePlayer = function(signature, ticksPerBeat)
{
  CHECK_TYPE(signature, Signature);
  this.signature_ = signature;
  this.ticksPerBeat_ = ticksPerBeat;
  this.eventSequence_ = new EventSequence();
  this.baseSequence_ = null;
  this.transpose_ = 0;
  this.processStack_ = new ProcessStack();
}

SequencePlayer.prototype.init = function(noteStream)
{
  this.noteStream_ = noteStream;
  this.eventSequence_.connect(this);
}


SequencePlayer.prototype.onEvent = function(events)
{
  var transpose = this.transpose_;
  var noteStream = this.noteStream_;

  // At this point, we recieve note pitches
  events.forEach(function(data) {
    CHECK_TYPE(data, NoteData)
    noteStream.add(new NoteData(data.pitch + transpose, data.velocity, data.length));
  });

}
SequencePlayer.prototype.render = function(timeline)
{
  CHECK_TYPE(timeline, Timeline);
  this.harmonicStructure_ = timeline;
  this.rebuild();
}

SequencePlayer.prototype.setSequence = function(sequence)
{
  this.baseSequence_ = sequence;
  this.rebuild();
}

SequencePlayer.prototype.transpose = function(value)
{
  this.transpose_ += value;
}

SequencePlayer.prototype.tick = function(position)
{
  if (this.baseSequence_ && this.harmonicStructure_)
  {
    this.eventSequence_.tick(position);
  }
}

SequencePlayer.prototype.rebuild = function()
{
  if (this.harmonicStructure_ && this.baseSequence_)
  {
    var rendered = renderSequence(this.harmonicStructure_, this.baseSequence_, this.signature_, this.ticksPerBeat_);
    var processed = this.processStack_.process(rendered.expand());
    this.eventSequence_.setContent(processed.compact());
  }
}
