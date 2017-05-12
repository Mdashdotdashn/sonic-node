// Chord progression helper object

var ChordProgressionBuilder = function(rootNote, mode)
{
  this.scaleNotes_ = scale(rootNote, mode);
  this.scaleNotes_.forEach(function(note)
    {
      this.scaleNotes_.push(note+12);
    }, this);
}

// Convert a string like bVIIsus4 to a property of the form
// { base: 7, pitchOffset: -1, alteration: "sus4"}  (pitchOffset is the pitch offset resulting of flattening)

var packDegreeProperties = function(degreeAsString)
{
  let flattened = degreeAsString[0] === 'b';
  let baseIndex = flattened ? 1 : 0;
  let pitchOffset =  flattened ? -1: 0;
  let base = parseInt( degreeAsString[baseIndex]);
  let alteration = degreeAsString.slice(baseIndex + 1);
  return { base: base, pitchOffset: pitchOffset, alteration : alteration};
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

// creates a chord progression from a list of scale degree
// supported format:
//
// 1,2,3: natural chord from the scale degree

makeChordProgression = function(rootNote, mode, progression)
{
  CHECK_TYPE(progression, Timeline);

  var builder = new ChordProgressionBuilder(rootNote, mode);

  const degreeToNotesFn = (degree) =>
  {
    const degreeAsString = ("" + degree).trim();
    const degreeProperties = packDegreeProperties(degreeAsString);
    return  builder.buildNotes(degreeProperties);
  };

  var noteProgression = new Timeline();

  progression.sequence.forEach(function(step)
  {
    noteProgression.add(degreeToNotesFn(step.element), step.position);
  });
  noteProgression.length = progression.length;
  return noteProgression;
}

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

invertElement = function(midiNoteList, distance)
{
  var sign = Math.sign(distance);
  var count = Math.abs(distance);

  var inverted = midiNoteList;

  for (var i = 0; i< count; i++)
  {
    switch(sign)
    {
      case 1:
        inverted.sort();
        var lowest = inverted.shift();
        lowest.pitch += 12;
        inverted.push(lowest);
        break;

      case -1:
        inverted.sort();
        var highest = inverted.pop();
        highest.pitch -= 12;
        inverted.unshift(highest);
    }
  }
  return inverted;
}
