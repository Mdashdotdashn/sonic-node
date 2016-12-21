
ChordPlayer = function()
{
  this.timeline_ = null;
  this.noteStream_ = null;
}

ChordPlayer.prototype.init = function(noteStream)
{
  this.noteStream = noteStream;
}

ChordPlayer.prototype.render = function(timeline)
{
  CHECK_TYPE(timeline, Timeline);
  this.timeline_ = timeline;
}

ChordPlayer.prototype.tick = function(position)
{
  if (this.timeline_)
  {
    var wrapped = moduloPosition(position, this.timeline_.length);
    var noteStream = this.noteStream_;
    this.timeline_.sequence.forEach(function(step){
      if ((step.position.beats_ == wrapped.beats_)
      &&(step.position.sixteenth_ == wrapped.sixteenth_)
      &&(step.position.ticks_ == wrapped.ticks_))
      {
        var index = 0;
        var offset = 0;
        step.element.voiced.forEach(function(pitch){
          var velocity = 1 - (0.2 * index) + offset;
          noteSream.add(new NoteData(pitch, velocity, 4));
          offset = Math.random() / 12;
          index++;
        })
      }
    })
  }
}
