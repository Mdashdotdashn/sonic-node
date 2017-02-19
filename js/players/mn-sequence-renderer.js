var renderSequenceWithTicks = function(harmonicStructure, baseSequence, ticksPerBeat)
{
  var renderedTimeline = new Timeline();
  renderedTimeline.length = createSequencingPosition(0, ticksPerBeat);

  var harmonyStepIndex = 0;
  // Do all of the harmonic steps
  while (harmonyStepIndex < harmonicStructure.sequence.length)
  {
    var fromStep = harmonicStructure.sequence[harmonyStepIndex];
    var lastStep = harmonyStepIndex == harmonicStructure.sequence.length - 1;

    var toStep = _.clone(harmonicStructure.sequence[lastStep ? 0 : harmonyStepIndex+1]);
    if (lastStep)
    {
      toStep.tickCount = harmonicStructure.length;
    }

    var renderedSlice = function(harmonyStepFrom, harmonyStepTo)
    {
      var sequenceIndex = 0;
      var render = true;

      var notes = harmonyStepFrom.element.notes;
      var baseSequenceOffset = 0;

      var renderedSlice = new Timeline();

      while (render)
      {
        var sequenceStep = baseSequence.sequence[sequenceIndex];
        var currentPosition = harmonyStepFrom.tickCount + sequenceStep.tickCount + baseSequenceOffset;

        if (currentPosition < harmonyStepTo.tickCount)
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
          renderedSlice.add(renderedNotes,position);

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
      renderedSlice.setLength(createSequencingPosition(harmonyStepTo.tickCount, ticksPerBeat));
      return renderedSlice;
    }(fromStep, toStep)

    renderedTimeline = mergeTimeline(renderedTimeline, renderedSlice);

    harmonyStepIndex++;
  }
  renderedTimeline.setLength(createSequencingPosition(harmonicStructure.length, ticksPerBeat));
  return renderedTimeline;
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

var expandToPositionArray = function(source, start, offset)
{
  CHECK_TYPE(start, SequencingPosition);
  CHECK_TYPE(offset, SequencingPosition);
  CHECK_TYPE(source, Array);

  var stepPosition = start;

  // create a (position, step) array
  var insertPositionFn = (step) => {
    var result;
    switch(typeof step)
    {
      case "string":
        result = { position: stepPosition, step: [parseInt(step)] };
        break;

      case "object":
        if (step instanceof Array)
        {
          result = { position: stepPosition, step: step.map((s) => parseInt(s)) };
        } else {
          var sequence = step.sequence;
          var subDivision = divPosition(offset, sequence.length);
          result = expandToPositionArray(sequence, stepPosition, subDivision);
        }
    }

    stepPosition = addPositions(stepPosition, offset);
    return result;
  };

  return _.flatten(source.map(insertPositionFn));
}

createSequenceFromDefinition = function(sequence, baseTime, signature)
{
  // initialize step position
  var start = createSequencingPosition(0, baseTime.ticksPerBeat_);
  var length = multPosition(baseTime, sequence.length);

  timedSequence = expandToPositionArray(sequence, start, baseTime);

  // remove any step with a rest
  var removeRestFn = (e) => (e.step != ".");

  // convert step from string to array and position to string
  var convertPositionFn = (e) => ({
     position: positionToString(e.position, signature),
     degrees:  e.step
   });

// build result array
   var result = new Object();

  result.sequence = timedSequence
    .filter(removeRestFn)
    .map(convertPositionFn);

  result.length = positionToString(length, signature);
  return result;
}
