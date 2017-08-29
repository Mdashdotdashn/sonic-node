var tonal = require ('tonal');

// returns the list of midi notes for a given scale

buildScaleNotes = function(midiRootNote, scaleName, alterations)
{
  var result = [];

  var intervals = tonal.scale.get(scaleName, false);
  var rootNote = midinotefromname(midiRootNote);

  for (var i of intervals)
  {
    result.push(rootNote + tonal.ivl.semitones(i));
  }

  if (alterations && alterations.length > 0)
  {
    for (var a of alterations)
    {
      var degree = Math.abs(a);
      var offset = Math.sign(a);

      if (degree <= result.length)
      {
        result[degree - 1] += offset;
      }
    }
  }
  return result;
}

computeScaleScore = function(scaleName, intervalsToMatch, offset)
{
  // Get tonal intervals
  var scaleIntervals = tonal.scale.get(scaleName, false);
  var intervals = [0,0,0,0,0,0,0,0,0,0,0,0];
  var currentIndex = offset;
  intervals[currentIndex] = 1;
  scaleIntervals.forEach(function(interval)
  {
    intervalIndex = tonal.ivl.semitones(interval) + offset;
    intervals[intervalIndex % 12] = 1;
  });
//  console.log(indexes);

  var score = 0;
  var base = 0;

  for (var index = 0; index < intervalsToMatch.length; index++)
  {
      if (intervalsToMatch[index] === 1)
      {
        score+= intervals[index] === 1 ? 1 : -1;
        base += 1;
      }
  }
  return score/base;
}

// try to detect the scale name from a list of note indexes

matchScaleListFromIndexes = function(indexes, scaleList)
{
  //  console.log(indexes);

    var bestScore = 0;
    var winnerList = [];

    scaleList.forEach(function(scaleName)
    {
      for (var offset = 0; offset < 12; offset++)
      {
        score = computeScaleScore(scaleName, indexes , offset);
        if (score > bestScore)
        {
          bestScore = score;
          winnerList = [];
        }

        if (score === bestScore)
        {
          winnerList.push("" + notefromdegree(offset) + " " + scaleName);
        }
      }
    })

    var result =
    {
      score_ : bestScore,
      scaleList_ : winnerList
    };
    return result;
}

scalesFromIndexes = function(indexes)
{
  // First try with a reduced set. If we don't find it within it, expand to all known scales
  var reducedSet =  ["major", "minor", "harmonic minor", "dorian", "phrygian", "lydian"];
  var result = matchScaleListFromIndexes(indexes, reducedSet);
  return result.score_ == 1
    ? result
    : matchScaleListFromIndexes(indexes, tonal.scale.names());
}

// Attempts to order the scale list so that the ones contaning the firt note
// are presented first

filterScaleResult = function(result, firstNote)
{
  var filtered = [];
  result.scaleList_.forEach(function(scale)
  {
    if (scale[0].toLowerCase() == firstNote[0].toLowerCase())
    {
      filtered.push(scale);
    }
  });
  if (filtered.length != 0)
  {
    result.scaleList_ = filtered;
  }
  return result;
}

// try to detect possible scales from a list of notes

scalesFromNotes = function(noteNameList)
{
  var indexes = [0,0,0,0,0,0,0,0,0,0,0,0];
  var c4 = midinotefromname("c4");

  noteNameList.forEach(function(noteName)
  {
    var index = indexfromnotename(noteName);
    indexes[index] = 1;
  });

  return filterScaleResult(scalesFromIndexes(indexes), noteNameList[0]);

}
// try to detect the scale name from a list of chord names

scalesFromChords = function(chordNameList)
{
  // build a vector of note indexes, based on C4
  // because at this point, we can't manipulate chords/intervals directly

  var c4 = midinotefromname("c4");

  var indexes = [0,0,0,0,0,0,0,0,0,0,0,0];
  chordNameList.forEach(function(chordName)
  {
    var midiChord = chordName + "4";
    var midiNotes = notesfromchordname(midiChord);
    midiNotes.forEach(function(midiNote)
    {
      var interval = (midiNote - c4) % 12;
      indexes[interval] = 1;
    })
  })

  return filterScaleResult(scalesFromIndexes(indexes), chordNameList[0]);
}
