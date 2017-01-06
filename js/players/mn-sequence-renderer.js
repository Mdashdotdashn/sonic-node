var renderSequenceWithTicks = function(harmonicStructure, baseSequence, ticksPerBeat)
{
  var result = new Timeline();

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
        // Expand degree data

        var degreeData = sequenceStep.degrees.map(function(degreeElement)
        {
          var isNumber = typeof degreeElement == "number";
          var degree = isNumber ? degreeElement : degreeElement.d;
          var transpose = isNumber ? 0 : degreeElement.t;
          return { degree: degree, transpose: transpose}
        })

        var step = new Object;
        var position = createSequencingPosition(currentPosition, ticksPerBeat);

       var renderedNotes = degreeData.filter(function(e)
        {
          return (e.degree < notes.length)
        }).map(function(e)
        {
          velocity = 1;
          return new NoteData(notes[e.degree].pitch + e.transpose , velocity, 12)
        })
        result.add(renderedNotes,position);

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
  result.setLength(createSequencingPosition(harmonicStructure.length, ticksPerBeat));
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
  tickBaseSequence.sequence = baseSequence.sequence.map(
    function(element)
    {
      var tickCount = stringPositionToTicks(element.position, signature, ticksPerBeat);
      return {
        tickCount: tickCount,
        degrees: element.degrees,
      };
    })

  // Convert harmonicStructure to use ticks for position

  var tickBasedStructure = new Object;
  tickBasedStructure.length = ticksFromPosition(harmonicStructure.length, signature, ticksPerBeat);
  tickBasedStructure.sequence = harmonicStructure.sequence.map(
    function(item)
    {
      return {
          tickCount: ticksFromPosition(item.position, signature, ticksPerBeat),
          element: item.element
        }
    });

  return renderSequenceWithTicks(tickBasedStructure, tickBaseSequence, ticksPerBeat);
}
