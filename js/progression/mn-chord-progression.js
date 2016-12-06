// Build a chord object to manipulate the content

ProgressionElement = function (notes, bass)
{
  this.notes_ = notes;
  this.bass_ = bass;
}

// return the notes

ProgressionElement.prototype.notes = function()
{
  return this.notes_;
}

// Chord progression helper object

ChordProgression = function(rootNote, mode)
{
  this.scaleNotes_ = scale(rootNote, mode);
  this.scaleNotes_.forEach(function(note)
    {
      this.scaleNotes_.push(note+12);
    }, this);
}

// return the chord corresponding to the nth degree in the current progression
// n starts with 1

ChordProgression.prototype.makeChord = function(degree, alteration)
{
  var n = this.scaleNotes_;
  var root = n[degree-1];
  var bass = root - 24;

  // If there's an alteration, force it
  if (alteration && alteration.length_ != 0)
  {
      var current = root;
      var notes = [ current ];
      var intervals = intervalsFromChordToken(alteration);
      intervals.forEach(function(interval) {
        current += interval;
        notes.push(current);
      })
      return new ProgressionElement(notes, bass )
  }
  // return the default chord for the scale
  return new ProgressionElement([n[degree-1], n[degree+1], n[degree+3]], bass);
}

// creates a chord progression from a list of scale degree
// supported format:
//
// 1,2,3: natural chord from the scale degree

makeChordProgression = function(rootNote, mode, progression)
{
    var cp = new ChordProgression(rootNote, mode);
    var chordSequence = [];

    progression.forEach(function(degree) {
      var degreeAsString = ("" + degree).trim();
      var base = parseInt(degreeAsString[0]);
      var alteration = degreeAsString.slice(1);
      chordSequence.push(cp.makeChord(base, alteration));
      });

    return chordSequence;
}

// creates a chord progression from a list chord names

makeChordSequence = function(chordNames)
{
    var chordSequence = [];
    chordNames.forEach(function(chordName)
    {
        chordSequence.push(new ProgressionElement(notesfromchordname(chordName)));
    });

    return chordSequence;
}
