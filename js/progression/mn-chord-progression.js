_ = require("lodash");
tonal=require("tonal");

// Returns a timeline with the intervals corresponding to the chord progression
// i.e. convert a timeline progression { 1, 3, b5} to {{1P,3M,5P}, ...}
buildChordProgression = function(degreeProgression, scaleIntervals)
{
  CHECK_TYPE(degreeProgression, Timeline);

  return degreeProgression.mapSteps(function(degree)
  {
    var degreeString = "" + degree;

    // convert the degree string to be compatible with tonal
    // the degree string is in the form ([b]5[type])

    let flattened = degreeString[0] === 'b';
    let sharpened = degreeString[0] === '#';

    let baseStringIndex = flattened || sharpened ? 1 : 0;
    let baseInterval = parseInt( degreeString[baseStringIndex]);
    var type = degreeString.slice(baseStringIndex + 1);

    // if type isn't specified, we deduce it from the scale intervals
    if (type == "")
    {
      let scaleSize = scaleIntervals.length;
      // In order to deduce the chord type, we pack all intervals from the chord and ask tonal what it is
      chordintervals = [0, 2, 4].map(function(chordDegree)
      {
        index = baseInterval -1 + chordDegree;
        return scaleIntervals[index % scaleSize];
      });
      type = chordTypeFromIntervalList(chordintervals);
    }

    var offsetTranspose = (flattened ? "-2m" : (sharpened ? "2m" : "1P"));

    var romanDegree =
      tonal.progression.buildRoman(baseInterval -1) +
      type;

    var parsed = tonal.progression.parseRomanChord(romanDegree);
    return tonal.chord.intervals(parsed.type).map(tonal.transpose(scaleIntervals[baseInterval -1])).map(tonal.transpose(offsetTranspose));
  });
}

// invert the notes of a list

invertChord = function(midiNoteList, distance)
{
  var sign = Math.sign(distance);
  var count = Math.abs(distance);

  var degree = 1;
  var inverted = midiNoteList.map(function(e){
    var pair = { note: e, degree: degree};
    degree++;
    return pair;
  });

  for (var i = 0; i< count; i++)
  {
    switch(sign)
    {
      case 1:
        inverted = _.sortBy(inverted,'note');
        var lowest = inverted.shift();
        lowest.note += 12;
        inverted.push(lowest);
        break;

      case -1:
        inverted = _.sortBy(inverted,'note');
        var highest = inverted.pop();
        highest.note -= 12;
        inverted.unshift(highest);
    }
  }

  return _(inverted).sortBy('degree').map((e) => e.note).value();
}
