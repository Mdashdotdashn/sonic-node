var ChordIntervals =
{
  major: [4,3],
  minor: [3,4],
  diminished: [3,3],
  augmented: [4,4]
}

var ChordAlterationsToken =
{
  "M" : "major",
  "m" : "minor",
  "°" : "diminished",
  "aug" : "augmented"
}

intervalsFromChordToken = function(token)
{
  var chordType = ChordAlterationsToken[token];
  return eval("ChordIntervals."+chordType);
}
