var note_gravity_center = function(notes)
{
  var sum = 0.0;
  notes.forEach(function(note)
    {
      sum += note;
    });
  return sum / notes.length;
}


Chord = function (notes)
{
  this.notes_ = notes;
}

Chord.prototype.notes = function()
{
  return this.notes_;
}

Chord.prototype.distanceFrom = function(fromChord)
{
  return note_gravity_center(this.notes_) - note_gravity_center(fromChord.notes_); 
}
