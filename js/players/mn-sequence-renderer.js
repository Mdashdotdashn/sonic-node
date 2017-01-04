var renderSequenceWithTicks = function(harmonicStructure, baseSequence, ticksPerBeat)
{
  var result = new Object;
  result.length = createSequencingPosition(harmonicStructure.length, ticksPerBeat);
  result.sequence = [];

  var harmonyIndex = 0;
  // Do all of the harmonic steps
  while (harmonyIndex < harmonicStructure.sequence.length)
  {
    var harmonyStep = harmonicStructure.sequence[harmonyIndex];

    var stepEndPosition =
      harmonyIndex < harmonicStructure.sequence.length - 1
      ?  harmonicStructure.sequence[harmonyIndex + 1].tickCount
      :  harmonicStructure.length;

      // At this point, we'll a new copy the base sequence and loop it until the next or final step

    var sequenceIndex = 0;
    var render = true;

    var notes = harmonyStep.element.notes;
    var baseSequenceOffset = 0;

    while (render)
    {
      var sequenceStep = baseSequence.sequence[sequenceIndex];
      var currentPosition = harmonyStep.tickCount + sequenceStep.tickCount + baseSequenceOffset;

      if (currentPosition < stepEndPosition)
      {
        var step =
          {
            position: createSequencingPosition(currentPosition, ticksPerBeat),
            notes: []
          }

        sequenceStep.degrees.forEach(function(degreeElement){
          var isNumber = typeof degreeElement == "number";
          var degree = isNumber ? degreeElement : degreeElement.d;
          var transpose = isNumber ? 0 : degreeElement.t;
          if (degree < notes.length)
          {
            velocity = 1;
            var data = new NoteData(notes[degree].pitch + transpose , velocity, 12)
            step.notes.push(data);
          }
        })

        result.sequence.push(step);

        // next one and wrap sequence if needed
        sequenceIndex++;
         if (sequenceIndex >= baseSequence.sequence.length)
         {
           sequenceIndex = 0;
           baseSequenceOffset += baseSequence.length;
//           render = false; // for a single iteration
         }
      }
      else {
        render = false;
      }
    }

    harmonyIndex++;
  }
  return result;
}

// renders a serie of note events to be played from
// a base array sequence in the form:
//   { position: "1.1.1", degrees: [1,3] }
// and a harmonic structure
//   structure: [{ position: "1.1.1", midiNoteList: [35,67] }]
//   length: "4.1.1" // In bars

renderSequence = function(harmonicStructure, baseSequence, signature, ticksPerBeat)
{
  CHECK_TYPE(harmonicStructure, Timeline);
  // Convert base sequence to use ticks for position
  var tickBaseSequence = new Object;
  tickBaseSequence.length = stringPositionToTicks(baseSequence.length, signature, ticksPerBeat);
  tickBaseSequence.sequence = [];

  baseSequence.sequence.forEach(function(element)
  {
    tickBaseSequence.sequence.push(
      {
        tickCount: stringPositionToTicks(element.position, signature, ticksPerBeat),
        degrees: element.degrees
      });
  })

  // Convert harmonicStructure to use ticks for position

  var tickBasedStructure = new Object;
  tickBasedStructure.length = ticksFromPosition(harmonicStructure.length, signature, ticksPerBeat);
  tickBasedStructure.sequence = [] ;

  harmonicStructure.sequence.forEach(function(item)
  {
    tickBasedStructure.sequence.push(
      {
        tickCount: ticksFromPosition(item.position, signature, ticksPerBeat),
        element: item.element
      }
    )
  });

  return renderSequenceWithTicks(tickBasedStructure, tickBaseSequence, ticksPerBeat);
}
