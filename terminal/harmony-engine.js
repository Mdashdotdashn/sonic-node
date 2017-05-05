
HarmonyEngine = function()
{
  this.progression_ = [];
	this.scale_ = "major";
	this.rootNote_ = "c4";
	this.inversion_ = -2;
}

HarmonyEngine.prototype.setScale = function(scale, rootNote)
{
  this.scale_ = scale;
  this.rootNote_ = rootNote+"4";
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
		var progression = makeChordProgression(this.rootNote_, this.scale_, this.progression_);
		// apply desired inversion to the first chord
		progression.sequence[0].element = invertElement(progression.sequence[0].element,this.inversion_);
		return progression;
  }
}
