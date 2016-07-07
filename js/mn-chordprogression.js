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

//------------------------------------------------------------

var rectify_closest = function(from, to)
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

  sequence[rightIndex--] = rectify_closest(sequence[0], sequence[rightIndex]);

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
      rectify_progression_sequential(sequence);
      break;
    case 1:
      rectify_progression_to_first(sequence);
      break;
    case 2:
      rectify_progression_inwards(sequence);
      break;
  }
}

makeChordProgression = function(rootNote, scale, progression)
{
    var cp = new ChordProgression(rootNote, scale);
    var chordSequence = [];
    progression.forEach(function(degree) {
      chordSequence.push(cp.chord(degree));
      });

    return chordSequence;   
}

makeChordSequence = function(chordNames)
{
    var chordSequence = [];
    chordNames.forEach(function(chordName)
    {
        chordSequence.push(new Chord(notesfromchordname(chordName)));
    });

    return chordSequence;
}