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

Chord.prototype.invertUp = function()
{
  this.notes_.sort();
  var lowest = this.notes_.shift();
  this.notes_.push(lowest+12);
}

Chord.prototype.invertDown = function()
{
  this.notes_.sort();
  var highest = this.notes_.pop();
  this.notes_.unshift(highest-12);
}

Chord.prototype.invert = function(distance)
{
  var sign = Math.sign(distance);
  var count = Math.abs(distance);

  for (var i = 0; i< count; i++)
  {
    switch(sign)
    {
      case 1:
        this.invertUp();
        break;

      case -1:
        this.invertDown();
    }
  }
}

chordname = function(chord)
{
  var c = [];
  chord.forEach(function(note)
    {
      n = note % 12;
      c.push(n);
    });
  c.sort();
  console.log(c);
  return "---";
}
