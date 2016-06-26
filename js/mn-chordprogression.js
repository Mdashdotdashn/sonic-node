require("./mn-chord.js");

ChordProgression = function(noteName, scaleName)
{
  this.scaleNotes_ = scale(noteName, scaleName);
  this.scaleNotes_.forEach(function(note)
    {
      this.scaleNotes_.push(note+12);
    }, this);
}

ChordProgression.prototype.chord = function(degree)
{
  var n = this.scaleNotes_;
  return new Chord([n[degree-1], n[degree+1], n[degree+3]]);
}

