_ = require("lodash");

SequencePlayer = function(signature, ticksPerBeat)
{
  CHECK_TYPE(signature, Signature);
  this.signature_ = signature;
  this.ticksPerBeat_ = ticksPerBeat;
  this.eventSequence_ = new EventSequence();
  this.baseSequence_ = null;
  this.transpose_ = 0;
  this.voiceLeadingMethod_ = 1;
  this.transformationStack_ = new SequenceTransformationStack();
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


SequencePlayer.prototype.setHarmonicTimeline = function(timeline)
{
  if (timeline)
  {
    CHECK_TYPE(timeline, Timeline);
  }
  this.harmonicStructure_ = timeline;
  this.rebuild();
}


SequencePlayer.prototype.setSequence = function(sequence)
{
  this.baseSequence_ = sequence;
  this.rebuild();
}


SequencePlayer.prototype.setVoiceLeading = function(method)
{
  this.voiceLeadingMethod_ = method;
  this.rebuild();
}


SequencePlayer.prototype.pushTransformation = function(transform)
{
  this.transformationStack_.add(transform);
  this.rebuild();
}

SequencePlayer.prototype.resetTransformation = function()
{
  this.transformationStack_.reset();
  this.rebuild();
}

SequencePlayer.prototype.transpose = function(value)
{
  this.transpose_ = value;
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
    var rectified = rectify_progression(this.harmonicStructure_, this.voiceLeadingMethod_);
    var sorted = rectified.mapSteps((element) => _.sortBy(element));
    var rendered = renderSequence(sorted, this.baseSequence_, this.signature_, this.ticksPerBeat_);
    var processed = this.transformationStack_.process(rendered.expand());
    this.eventSequence_.setContent(processed.compact());
  }
}
