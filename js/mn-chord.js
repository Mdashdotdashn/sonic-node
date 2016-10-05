// Computes the center of gravity for a group of notes

var note_gravity_center = function(notes)
{
  var sum = 0.0;
  notes.forEach(function(note)
    {
      sum += note;
    });
  return sum / notes.length;
}

// Build a chord object to manipulate the content

Chord = function (notes, bass)
{
  this.notes_ = notes;
  this.bass_ = bass;
}

// return the notes

Chord.prototype.notes = function()
{
  return this.notes_;
}

// Computes the distance between two chords

Chord.prototype.distanceFrom = function(fromChord)
{
  return note_gravity_center(this.notes_) - note_gravity_center(fromChord.notes_);
}

// Inverts the chord upwards

Chord.prototype.invertUp = function()
{
  this.notes_.sort();
  var lowest = this.notes_.shift();
  this.notes_.push(lowest+12);
}

// Inverts the chord downwards

Chord.prototype.invertDown = function()
{
  this.notes_.sort();
  var highest = this.notes_.pop();
  this.notes_.unshift(highest-12);
}

// Inverts the chord from a given amount

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

// Returns the notes for a given chord name (with octave e.g D4)

notesfromchordname = function(chordname)
{
  parseIndex = 0;
  var basenote = chordname.charAt(parseIndex++);
  if (chordname[parseIndex] === '#')
  {
    basenote += chordname.charAt(parseIndex++);
  }

  var minor =  false;

  if (chordname[parseIndex] === 'm')
  {
    minor = true;
    parseIndex++;
  }

  octave = 3;
  if (parseIndex < chordname.length)
  {
    octave = parseInt(chordname.charAt(parseIndex++));
  }

  var interval = intervalfromnotename(basenote);
  var note = (octave + 1) * 12 + interval;
  if (minor)
  {
    return [note, note + 3, note +7];
  }
  return [note, note + 4, note +7];
}

// given a collaction of note number, returns the name of a chord (without octave)
// Very coarse as it only supports major/minor

chordname = function(midiNotes)
{
  var chordintervals =
  {
    "4,3" : "",  // major
    "3,4" : "m", // minor
    "3,3" : "º",  // diminished
    "4,4" : "+"  //   augmented ?
  }

  // reduce notes to their index c,d,e..
  var c = [];
  midiNotes.forEach(function(note)
    {
      n = note % 12;
      c.push(n);
    });
  c.sort(function(a, b){return a - b});


  // try to work out the default inversion of the set
  for (var i = 0; i < c.length -1 ; i++)
  {
    if (c[i+1] - c[i] > 4)
    {
      c = c.rotate(i+1);
    }
  }

  // computes intervals between notes
  var d = [];
  for (var i = 0; i < c.length -1 ; i++)
  {
    if (c[i] > c[i+1])
    {
      c[i] -= 12;
    }

    d.push(c[i+1] - c[i]);
  }

  // makes chord name
  var note = notefromdegree(c[0]);
  return note + chordintervals[d.toString()];
}
