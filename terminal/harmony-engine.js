
HarmonyEngine = function()
{
  this.progression_ = [];
	this.scale_ = "major";
	this.rootNote_ = "c4";
	this.inversion_ = -2;
	this.rectificationMethod_ = 1;
}

HarmonyEngine.prototype.setScale = function(scale, rootNote)
{
  this.scale_ = scale;
  this.rootNote_ = rootNote+"4";
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
		var progression = makeChordProgression(this.rootNote_, this.scale_, this.progression_);
		// apply desired inversion to the first chord
		progression[0].notes = invertElement(progression[0].notes,this.inversion_);
		// apply voicing
		rectify_progression(progression, this.rectificationMethod_);
		return progression;
  }
  return [];
}
