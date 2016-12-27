// Build a chord object to manipulate the content

ProgressionElement = function (notes)
{
  this.notes = notes;
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
      return new ProgressionElement(notes)
  }
  // return the default chord for the scale
  return new ProgressionElement([n[degree-1], n[degree+1], n[degree+3]]);
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
      var flattened = degreeAsString[0] === 'b';
      var baseIndex = flattened ? 1 : 0;
      var base = parseInt( degreeAsString[baseIndex]);
      var alteration = degreeAsString.slice(baseIndex + 1);
      var element = cp.makeChord(base, alteration);
      if (flattened)
      {
        element.notes.forEach(function(note, index, array)
        {
          array[index] = note - 1;
        });
      }
      chordSequence.push(element);
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
