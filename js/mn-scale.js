require ("./mn-utils.js")
require ("./mn-note.js")

var ionian_sequence     = [2, 2, 1, 2, 2, 2, 1];
var hex_sequence        = [2, 2, 1, 2, 2, 3];
var pentatonic_sequence = [3, 2, 2, 3, 2];

var Scale = {
  diatonic:  ionian_sequence,
  ionian:    ionian_sequence,
  major:     ionian_sequence,
  dorian:    ionian_sequence.rotate(1),
  phrygian:  ionian_sequence.rotate(2),
  lydian:    ionian_sequence.rotate(3),
  mixolydian:         ionian_sequence.rotate(4),
  aeolian:   ionian_sequence.rotate(5),
  minor:     ionian_sequence.rotate(5),
  locrian:   ionian_sequence.rotate(6),
  hex_major6:         hex_sequence,
  hex_dorian:         hex_sequence.rotate(1),
  hex_phrygian:       hex_sequence.rotate(2),
  hex_major7:         hex_sequence.rotate(3),
  hex_sus:   hex_sequence.rotate(4),
  hex_aeolian:        hex_sequence.rotate(5),
  minor_pentatonic:   pentatonic_sequence,
  yu:        pentatonic_sequence,
  major_pentatonic:   pentatonic_sequence.rotate(1),
  gong:      pentatonic_sequence.rotate(1),
  egyptian:  pentatonic_sequence.rotate(2),
  shang:     pentatonic_sequence.rotate(2),
  jiao:      pentatonic_sequence.rotate(3),
  zhi:       pentatonic_sequence.rotate(4),
  ritusen:   pentatonic_sequence.rotate(4),
  whole_tone:         [2, 2, 2, 2, 2, 2],
  whole:     [2, 2, 2, 2, 2, 2],
  chromatic:          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  harmonic_minor:     [2, 1, 2, 2, 1, 3, 1],
  melodic_minor_asc:  [2, 1, 2, 2, 2, 2, 1],
  hungarian_minor:    [2, 1, 3, 1, 1, 3, 1],
  octatonic:          [2, 1, 2, 1, 2, 1, 2, 1],
  messiaen1:          [2, 2, 2, 2, 2, 2],
  messiaen2:          [1, 2, 1, 2, 1, 2, 1, 2],
  messiaen3:          [2, 1, 1, 2, 1, 1, 2, 1, 1],
  messiaen4:          [1, 1, 3, 1, 1, 1, 3, 1],
  messiaen5:          [1, 4, 1, 1, 4, 1],
  messiaen6:          [2, 2, 1, 1, 2, 2, 1, 1],
  messiaen7:          [1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  super_locrian:      [1, 2, 1, 2, 2, 2, 2],
  hirajoshi:          [2, 1, 4, 1, 4],
  kumoi:     [2, 1, 4, 2, 3],
  neapolitan_major:   [1, 2, 2, 2, 2, 2, 1],
  bartok:    [2, 2, 1, 2, 1, 2, 2],
  bhairav:   [1, 3, 1, 2, 1, 3, 1],
  locrian_major:      [2, 2, 1, 1, 2, 2, 2],
  ahirbhairav:        [1, 3, 1, 2, 2, 1, 2],
  enigmatic:          [1, 3, 2, 2, 2, 1, 1],
  neapolitan_minor:   [1, 2, 2, 2, 1, 3, 1],
  pelog:     [1, 2, 4, 1, 4],
  augmented2:         [1, 3, 1, 3, 1, 3],
  scriabin:  [1, 3, 3, 2, 3],
  harmonic_major:     [2, 2, 1, 2, 1, 3, 1],
  melodic_minor_desc: [2, 1, 2, 2, 1, 2, 2],
  romanian_minor:     [2, 1, 3, 1, 2, 1, 2],
  hindu:     [2, 2, 1, 2, 1, 2, 2],
  iwato:     [1, 4, 1, 4, 2],
  melodic_minor:      [2, 1, 2, 2, 2, 2, 1],
  diminished2:        [2, 1, 2, 1, 2, 1, 2, 1],
  marva:     [1, 3, 2, 1, 2, 2, 1],
  melodic_major:      [2, 2, 1, 2, 1, 2, 2],
  indian:    [4, 1, 2, 3, 2],
  spanish:   [1, 3, 1, 2, 1, 2, 2],
  prometheus:         [2, 2, 2, 5, 1],
  diminished:         [1, 2, 1, 2, 1, 2, 1, 2],
  todi:      [1, 2, 3, 1, 1, 3, 1],
  leading_whole:      [2, 2, 2, 2, 2, 1, 1],
  augmented:          [3, 1, 3, 1, 3, 1],
  purvi:     [1, 3, 2, 1, 1, 3, 1],
  chinese:   [4, 2, 1, 4, 1],
  lydian_minor:       [2, 2, 2, 1, 1, 2, 2]
}

// returns the list of midi notes for a given scale

buildScaleNotes = function(midiNoteName, scaleName, alterations)
{
  var s = eval("Scale."+scaleName);
  var note = midinotefromname(midiNoteName);
  var result = [];
  for (var interval of s)
  {
    result.push(note);
    note += interval;
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

computeScaleScore = function(scaleName, indexesToMatch, offset)
{
  var s = eval("Scale."+scaleName);
  var indexes = [0,0,0,0,0,0,0,0,0,0,0,0];
  var currentIndex = offset;
  indexes[currentIndex] = 1;
  s.forEach(function(interval)
  {
    currentIndex += interval;
    indexes[currentIndex % 12] = 1;
  });
//  console.log(indexes);

  var score = 0;
  var base = 0;

  for (var index = 0; index < indexesToMatch.length; index++)
  {
      if (indexesToMatch[index] === 1)
      {
        score+= indexes[index] === 1 ? 1 : -1;
        base += 1;
      }
  }
  return score/base;
}

// try to detect the scale name from a list of note indexes

scalesFromIndexes = function(indexes)
{
  //  console.log(indexes);

    var bestScore = 0;
    var winnerList = [];

    var testScales = ["major", "minor", "harmonic_minor", "dorian", "phrygian", "lydian"];

    testScales.forEach(function(scaleName)
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
    var interval = intervalfromnotename(noteName);
    indexes[interval] = 1;
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
