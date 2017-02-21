
//------------------------------------------------------------------------------

var BaseSequenceContext = function(base)
{
  this.index_ = 0;
  this.offset_ = 0;
  this.baseTick_ = 0;
  this.base_ = base;
  this.cycled_ = false;
}

BaseSequenceContext.prototype.reset = function(baseTick)
{
  var offset = baseTick - this.baseTick_;
  this.baseTick_ = baseTick;

  if (this.cycled_)
  {
    this.index_ = 0;
    this.offset_ = 0;
    this.cycled_ = false;
  }
  else
  {
    this.offset_ -= offset;
  }
};

BaseSequenceContext.prototype.position = function()
{
  return this.baseTick_ + this.base_.sequence[this.index_].tickCount + this.offset_;
}

BaseSequenceContext.prototype.stepData = function()
{
  var result = this.base_.sequence[this.index_].degrees.map(function(degreeElement)
  {
    var isNumber = typeof degreeElement == "number";
    var degree = isNumber ? degreeElement : degreeElement.d;
    var transpose = isNumber ? 0 : degreeElement.t;
    return { degree: degree, transpose: transpose}
  })
  return result;
}

BaseSequenceContext.prototype.next = function()
{
  // next one and wrap sequence if needed
   this.index_++;
   if (this.index_ >= this.base_.sequence.length)
   {
     this.index_ = 0;
     this.offset_ += this.base_.length;
     this.cycled_ = true;
   }
}

//------------------------------------------------------------------------------

var renderSequenceWithTicks = function(harmonicStructure, baseSequence, ticksPerBeat)
{
  var renderedTimeline = new Timeline();
  renderedTimeline.length = createSequencingPosition(0, ticksPerBeat);

  var baseSequenceContext = new BaseSequenceContext(baseSequence);

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
      var render = true;
      var notes = harmonyStepFrom.element.notes;

      var renderedSlice = new Timeline();

      baseSequenceContext.reset(harmonyStepFrom.tickCount);

      while (render)
      {
        var currentPosition = baseSequenceContext.position();

        if (currentPosition < harmonyStepTo.tickCount)
        {
          // Expand degree data

          var renderedNotes = baseSequenceContext.stepData().filter(function(e)
            {
              return (e.degree < notes.length)
            }).map(function(e)
            {
              velocity = 1;
              return new NoteData(notes[e.degree].pitch + e.transpose , velocity, 12)
            })

          var position = createSequencingPosition(currentPosition, ticksPerBeat);
          renderedSlice.add(renderedNotes,position);

          baseSequenceContext.next();
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
