chordTypeFromIntervalList = function (intervalList)
{
  // We need to recover the chord type from the interval list.
  // Since tonal list the result from (C->B) in the case there's several options
  // we first re-root the progression so the first interval is 1P
  var backToRoot = "-" + intervalList[0];
  transposed = intervalList.map(tonal.transpose(backToRoot));
  notes = tonal.harmonize(transposed, 'C');
  detected = tonal.chord.detect(notes);
  parsed = tonal.chord.parse(detected[0]);
  return parsed.type === "M" ? "" : parsed.type;
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

  var index = indexfromnotename(basenote);
  var note = (octave + 1) * 12 + index;
  if (minor)
  {
    return [note, note + 3, note +7];
  }
  return [note, note + 4, note +7];
}

// given a serie of midi notes belonging to a chord, tries to organise the notes
//  in a canonical form so that the root note is the lowest

makeCanonicalChord = function(midiNotes)
{
  // reduce notes to their index c,d,e..
  var c = [];
  midiNotes.forEach(function(note)
    {
      n = note % 12;
      c.push(n);
    });

  // remove duplicated
  c = c.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });

  // sort
  c.sort(function(a, b){return a - b});


  // try to work out the default inversion of the set
  for (var i = 0; i < c.length -1 ; i++)
  {
    if (c[i+1] - c[i] > 4)
    {
      c = c.rotate(i+1);
    }
  }

  return c;
}

// given a collaction of note number, returns the name of a chord (without octave)
// Very coarse as it only supports major/minor

chordname = function(midiNotes)
{
  // this should really be done from the chords intervals info
  var chordintervals =
  {
    "4,3" : "",  // major
    "3,4" : "m", // minor
    "3,3" : "dim",  // diminished
    "4,4" : "+",  //   augmented
    "4,2" : "sus4",  //   sus4
  }

  var c = makeCanonicalChord(midiNotes);

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

// Returns the root note index

rootofchord = function(midiNotes)
{
  var c = makeCanonicalChord(midiNotes);
  return c[0];
}
