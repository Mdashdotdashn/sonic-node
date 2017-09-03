// returns the chord type from the given interval list

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

// Returns the root note index

rootofchord = function(midiNotes)
{
  var c = makeCanonicalChord(midiNotes);
  return c[0];
}
