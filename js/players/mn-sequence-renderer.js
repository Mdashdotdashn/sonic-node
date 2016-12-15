var renderSequenceWithTicks = function(harmonicStructure, baseSequence, ticksPerBeat)
{
  var result = new Object;
  result.length = createSequencingPosition(harmonicStructure.length, ticksPerBeat);
  result.sequence = [];

  var harmonyIndex = 0;
  // Do all of the harmonic steps
  while (harmonyIndex < harmonicStructure.structure.length)
  {
    var harmonyStep = harmonicStructure.structure[harmonyIndex];

    var stepEndPosition =
      harmonyIndex < harmonicStructure.structure.length - 1
      ?  harmonicStructure.structure[harmonyIndex + 1].tickCount
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

        sequenceStep.degrees.forEach(function(degree){
          if (degree <= notes.length)
          {
            step.notes.push(notes[degree-1])
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

  var tickBaseStructure = new Object;
  tickBaseStructure.length = stringPositionToTicks(harmonicStructure.length, signature, ticksPerBeat);
  tickBaseStructure.structure = [] ;

  harmonicStructure.structure.forEach(function(item)
  {
    tickBaseStructure.structure.push(
      {
        tickCount: stringPositionToTicks(item.position, signature, ticksPerBeat),
        element: item.element
      }
    )
  });

  return renderSequenceWithTicks(tickBaseStructure, tickBaseSequence, ticksPerBeat);
}
