_ = require("lodash");
tonal=require("tonal");
// Chord progression helper object

var ChordProgressionBuilder = function(scaleIntervals)
{
  this.scaleNotes_ = scaleIntervals;
  this.scaleNotes_.forEach(function(note)
    {
      this.scaleNotes_.push(note+12);
    }, this);
}


// return the chord corresponding to the nth degree in the current progression
// n starts with 1

ChordProgressionBuilder.prototype.buildNotes = function(props)
{
  // Rather than remembering scale notes, we could remember the type of chord
  // And use uniformly intervalsFromChordToken rather than the current ternary switch

  const n = this.scaleNotes_;
  const baseIndex = props.base - 1;
  var root = n[baseIndex];

  const intervals =
    (props.alteration.length != 0)
    ? intervalsFromChordToken(props.alteration)
    : [ n[baseIndex+2] - root, n[baseIndex+4] - n[baseIndex+2] ];

  root += props.pitchOffset;
  let context = {
    current: root,
    notes: [root]
  };

  intervals.reduce((context, interval) => {
    context.current += interval;
    context.notes.push(context.current);
    return context;
  }, context)

  return context.notes;
}

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
// // creates a chord progression from a list of scale degree
// // supported format:
// //
// // 1,2,3: natural chord from the scale degree
//
// makeChordProgression = function(scaleIntervals, progression)
// {
//   CHECK_TYPE(progression, Timeline);
//
//   var builder = new ChordProgressionBuilder(scaleIntervals);
//
//   const degreeToNotesFn = (degree) =>
//   {
//     const degreeAsString = ("" + degree).trim();
//     const degreeProperties = packDegreeProperties(degreeAsString);
//     return  builder.buildNotes(degreeProperties);
//   };
//
//   var noteProgression = new Timeline();
//
//   progression.sequence.forEach(function(step)
//   {
//     noteProgression.add(degreeToNotesFn(step.element), step.position);
//   });
//   noteProgression.length = progression.length;
//   return noteProgression;
// }
//
stringForProgression = function(progression)
{
  var chordnameList = "";
	progression.sequence.forEach(function (step)
	{
		chordnameList += chordname(step.element) + ",";
	})
  return chordnameList;
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
