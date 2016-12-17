
ChordPlayer = function()
{
  this.timeline_ = null;
}

ChordPlayer.prototype.init = function(noteQueuer)
{
  this.noteQueuer_ = noteQueuer;
}

ChordPlayer.prototype.render = function(timeline)
{
//  CHECK_TYPE(timeline, Timeline);
  this.timeline_ = timeline;
}

ChordPlayer.prototype.tick = function(position)
{
  if (this.timeline_)
  {
    var wrapped = position;
    wrapped.beats_ %= this.timeline_.length_;
    var noteQueuer = this.noteQueuer_;

    this.timeline_.sequence_.forEach(function(step){
      if ((step.position.beats_ == wrapped.beats_)
      &&(step.position.sixteenth_ == wrapped.sixteenth_)
      &&(step.position.ticks_ == wrapped.ticks_))
      {
        var packet = [];
        var index = 0;
        var offset = 0;
        step.element.voiced.forEach(function(pitch){
          var velocity = 1 - (0.2 * index) + offset;
          packet.push({ pitch: pitch, velocity: velocity});
          offset = Math.random() / 12;
          index++;
        })
        noteQueuer.queueNotes(packet);
      }
    })
  }
}
