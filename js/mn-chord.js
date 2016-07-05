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

// Very coarse
// only supports major/minor
chordname = function(chord)
{
  var chordintervals = 
  {
    "4,3" : "",  // major
    "3,4" : "m", // minor
  }

  // reduce notes to their degree c,d,e..
  var c = [];
  chord.forEach(function(note)
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
