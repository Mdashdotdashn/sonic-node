
HarmonyEngine = function()
{
  this.progression_ = [];
  this.rootNote_ = "c";
  this.scaleIntervals_ = buildScaleIntervals("major");
	this.inversion_ = 0;
}

HarmonyEngine.prototype.setScale = function(scalename, rootNote, alterations)
{
  this.rootNote_ = rootNote;
  this.scaleIntervals_ = buildScaleIntervals(scalename, alterations);
}

HarmonyEngine.prototype.setInversion = function(inversion)
{
  this.inversion_ = inversion;
}

HarmonyEngine.prototype.setProgression = function(progression)
{
  CHECK_TYPE(progression, Timeline);
  this.progression_ = progression;
}

HarmonyEngine.prototype.rebuild = function()
{
  if (this.progression_.length != 0)
	{
		// create chord progression
		var progression = buildChordProgression(this.progression_, this.scaleIntervals_);
    return progression;
		// apply desired inversion to the first chord
//    return progression.mapSteps((x) => invertChord(x,this.inversion_));
  }
}

// returns the string of the chord based on the degree description
HarmonyEngine.prototype.chordProgressionString = function(chordIntervalsTimeline)
{
  var result = "";
  var rootNote = this.rootNote_;
  chordIntervalsTimeline.sequence.forEach(function(step, index)
  {
    var chordType = chordTypeFromIntervalList(step.element);
    var note = tonal.harmonize(step.element[0], rootNote);
    result += note + chordType +",";
  })
  return result;
}

// returns the string of the chord based on the degree description
HarmonyEngine.prototype.degreeProgressionString = function(degreeTimeline)
{
  CHECK_TYPE(degreeTimeline, Timeline);

  var progression = buildChordProgression(degreeTimeline, this.scaleIntervals_);

  return this.chordProgressionString(progression);
}
