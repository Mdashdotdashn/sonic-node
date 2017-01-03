var ChordIntervals =
{
  major: [4,3],
  minor: [3,4],
  diminished: [3,3],
  augmented: [4,4],
  sus4: [4,2],
}

var ChordAlterationsToken =
{
  "M" : "major",
  "m" : "minor",
  "°" : "diminished",
  "aug" : "augmented",
  "+" : "augmented",
  "sus4" : "sus4",
}

intervalsFromChordToken = function(token)
{
  var chordType = ChordAlterationsToken[token];
  return eval("ChordIntervals."+chordType);
}
