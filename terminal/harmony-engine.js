
HarmonyEngine = function()
{
  this.progression_ = [];
  this.scaleIntervals_ = buildScaleNotes("c4", "major");
	this.inversion_ = 0;
}

HarmonyEngine.prototype.setScale = function(scalename, rootNote, alterations)
{
  this.scaleIntervals_ = buildScaleNotes(rootNote+"4", scalename, alterations);
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
		var progression = makeChordProgression(this.scaleIntervals_, this.progression_);
		// apply desired inversion to the first chord
    return progression.mapSteps((x) => invertChord(x,this.inversion_));
  }
}
