
var expandToPositionArray = function(source, start, offset, convertFn)
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
        result = { position: stepPosition, element: [convertFn(step)] };
        break;

      case "object":
        if (step instanceof Array)
        {
          result = { position: stepPosition, element: step.map((s) => convertFn(s)) };
        } else {
          var sequence = step.sequence;
          var subDivision = divPosition(offset, sequence.length);
          result = expandToPositionArray(sequence, stepPosition, subDivision, convertFn);
        }
    }

    stepPosition = addPositions(stepPosition, offset);
    return result;
  };

  return _.flatten(source.map(insertPositionFn));
}

splitTokenSequence = function(sequence, baseTime, signature, convertFn)
{
  // initialize step position
  var start = createSequencingPosition(0, baseTime.ticksPerBeat_);
  var length = multPosition(baseTime, sequence.length);

  timedSequence = expandToPositionArray(sequence, start, baseTime, convertFn);

  // remove any step with a rest
  var removeRestFn = (e) => (e.element != ".");

// build result array
   var result = new Timeline();

  result.sequence = timedSequence
    .filter(removeRestFn)

  result.length = length;
  return result;
}

createSequenceFromDefinition = function(sequence, baseTime, signature)
{
  return splitTokenSequence(sequence, baseTime, signature, parseInt);
}

createProgressionFromDefinition = function(sequence, baseTime, signature)
{
  return splitTokenSequence(sequence, baseTime, signature, (x) => x);
}
