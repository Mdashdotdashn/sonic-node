require("./mn-chord.js");
require("./mn-scale.js");
require("./theory/theory.js");

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
      return new Chord(notes, bass )
  }
  // return the default chord for the scale
  return new Chord([n[degree-1], n[degree+1], n[degree+3]], bass);
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
        chordSequence.push(new Chord(notesfromchordname(chordName)));
    });

    return chordSequence;
}

//------------------------------------------------------------

rectify_closest = function(from, to)
{
  var d = to.distanceFrom(from);
  var sign = Math.sign(d);
  d = Math.abs(d);
  var mind = 1000;

  while(mind > d)
  {
    mind =d;
    to.invert(-sign);
    d = Math.abs(to.distanceFrom(from));
  }
  to.invert(sign);
  return to;
}

var rectify_progression_sequential = function(sequence)
{
  for (var i = 0; i < sequence.length-1; i++)
  {
    sequence[i+1] = rectify_closest(sequence[i],sequence[i+1]);
  }
}

var rectify_progression_to_first = function(sequence)
{
  for (var i = 0; i < sequence.length-1; i++)
  {
    sequence[i+1] = rectify_closest(sequence[0],sequence[i+1]);
  }
}

var rectify_progression_inwards = function(sequence)
{
  var leftIndex = 1;
  var rightIndex = sequence.length -1;

  sequence[rightIndex] = rectify_closest(sequence[0], sequence[rightIndex]);
  rightIndex--;

  while (leftIndex < rightIndex)
  {
    sequence[leftIndex] = rectify_closest(sequence[leftIndex -1], sequence[leftIndex]);
    leftIndex++;
    if (rightIndex > leftIndex)
    {
      sequence[rightIndex] = rectify_closest(sequence[rightIndex+1], sequence[rightIndex]);
      rightIndex--;
    }
  }
}

rectify_progression = function(sequence, mode)
{
  switch(mode)
  {
    case 0:
      break;
    case 1:
      rectify_progression_sequential(sequence);
      break;
    case 2:
      rectify_progression_to_first(sequence);
      break;
    case 3:
      rectify_progression_inwards(sequence);
      break;
  }
}
