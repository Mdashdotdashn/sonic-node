
SequencePlayer = function(signature, ticksPerBeat)
{
  CHECK_TYPE(signature, Signature);
  this.signature_ = signature;
  this.ticksPerBeat_ = ticksPerBeat;
  this.eventSequence_ = new EventSequence();
  this.baseSequence_ = null;
  this.noteQueuer_ = null;
}

SequencePlayer.prototype.init = function(noteQueuer)
{
  this.noteQueuer_ = noteQueuer;
  this.eventSequence_.connect(function(event){
    // At this point, we recieve note pitches
    var packet = [];
    event.forEach(function(pitch) {
      var velocity = 1;
      packet.push({ pitch: pitch, velocity: velocity, length : 4});
    });
    noteQueuer.queueNotes(packet);
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
    var eventSequence = [];
    rendered.sequence.forEach(function(element){
      eventSequence.push({ position: element.position, value: element.notes});
    })
    this.eventSequence_.setContent(eventSequence, rendered.length);
  }
}
