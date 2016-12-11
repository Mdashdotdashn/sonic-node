
HarmonyEngine = function()
{
  this.progression_ = [];
	this.scale_ = "major";
	this.rootNote_ = "c3";
	this.inversion_ = -2;
	this.rectificationMethod_ = 1;
}

HarmonyEngine.prototype.setScale = function(scale, rootNote)
{
  this.scale_ = scale;
  this.rootNote_ = rootNote;
}

HarmonyEngine.prototype.setRectification = function(rectificationMethod)
{
  this.rectificationMethod_ = rectificationMethod;
}

HarmonyEngine.prototype.setInversion = function(inversion)
{
  this.inversion_ = inversion;
}

HarmonyEngine.prototype.setProgression = function(progression)
{
  this.progression_ = progression;
}

HarmonyEngine.prototype.rebuild = function()
{
  if (this.progression_.length != 0)
	{
		// create chord progression
		var chordSequence = makeChordProgression(this.rootNote_, this.scale_, this.progression_);
		// apply desired inversion to the first chord
		chordSequence[0].notes_ = invertChord(chordSequence[0].notes_,this.inversion_);
		// apply voicing
		rectify_progression(chordSequence, this.rectificationMethod_);
		return chordSequence;
  }
}
