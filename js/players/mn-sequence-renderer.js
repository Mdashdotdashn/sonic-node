
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
  return this.baseTick_ + this.base_.sequence[this.index_].position + this.offset_;
}

BaseSequenceContext.prototype.stepData = function()
{
  var result = this.base_.sequence[this.index_].element.map(function(degreeElement)
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
  CHECK_TYPE(harmonicStructure, Timeline);
  CHECK_TYPE(baseSequence, Timeline);

  var renderedTimeline = new Timeline();
  renderedTimeline.length = createSequencingPosition(0, ticksPerBeat);

  var baseSequenceContext = new BaseSequenceContext(baseSequence);

  var harmonyStepIndex = 0;
  // Do all of the harmonic steps
  while (harmonyStepIndex < harmonicStructure.sequence.length)
  {
    // Prepare data for from step
    var fromStep = harmonicStructure.sequence[harmonyStepIndex];

    // Prepare data for to step. If we're doing the last index, to step is the first one
    var isLastStep = (harmonyStepIndex == harmonicStructure.sequence.length - 1);
    var toStep = _.clone(harmonicStructure.sequence[isLastStep ? 0 : harmonyStepIndex+1]);
    if (isLastStep)
    {
      toStep.position = harmonicStructure.length;
    }

    var renderedSlice = function(harmonyStepFrom, harmonyStepTo)
    {
      var render = true;
      var notes = harmonyStepFrom.element;

      var renderedSlice = new Timeline();

      baseSequenceContext.reset(harmonyStepFrom.position);

      while (render)
      {
        var currentPosition = baseSequenceContext.position();

        if (currentPosition < harmonyStepTo.position)
        {
          // Expand degree data

          var baseSequenceStep = baseSequenceContext.stepData();
          var renderedNotes = baseSequenceStep.filter(function(e)
            {
              return (e.degree -1 < notes.length)
            }).map(function(e)
            {
              velocity = 1;
              return new NoteData(notes[e.degree -1] + e.transpose , velocity, 12)
            })

          var position = createSequencingPosition(currentPosition, ticksPerBeat);
          renderedSlice.add(renderedNotes,position);

          baseSequenceContext.next();
        }
        else {
          render = false;
        }
      }
      renderedSlice.setLength(createSequencingPosition(harmonyStepTo.position, ticksPerBeat));
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

renderSequence = function(rootNote, harmonicStructure, baseSequence, signature, ticksPerBeat)
{
  CHECK_TYPE(harmonicStructure, Timeline);
  CHECK_TYPE(baseSequence, Timeline);

  // convert base sequence to ticks and harmonize it

  tickBaseSequence = baseSequence.mapSteps(
    (element) => element,
    (position) =>  ticksFromPosition(position, signature, ticksPerBeat)
  );


  tickBasedStructure = harmonicStructure.mapSteps(
    (element) => tonal.harmonize(element, rootNote).map((s) => tonal.note.midi(s)),
    (position) =>  ticksFromPosition(position, signature, ticksPerBeat)
  );
  return renderSequenceWithTicks(tickBasedStructure, tickBaseSequence, ticksPerBeat);
}
