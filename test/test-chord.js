var assert = require("assert");

require("../js/theory/theory.js");

function convertToMidiNote(noteList)
{
  var midiNotes = [];
  noteList.forEach(function(noteName)
  {
    midiNotes.push(midinotefromname(noteName + "4"));
  });
  return midiNotes;
}

function testChordName(noteList, expectedChord)
{
  var chordName = chordname(convertToMidiNote(noteList));
  assert.equal(chordName,expectedChord);
}

function testChordRootIndex(noteList, expectedRootNote)
{
  var expectedRootIndex = intervalfromnotename(expectedRootNote);
  var chordRootIndex = rootofchord(convertToMidiNote(noteList));
  assert.equal(chordRootIndex, expectedRootIndex);
}

testChordName([ "G" , "E", "C"], "C");
testChordName([ "E" , "C", "G"], "C");
testChordName([ "G" , "D#", "C"], "Cm");
testChordName([ "B" , "G", "D"], "G");

testChordRootIndex([ "B" , "G", "D" ], "G"); // G chord
testChordRootIndex([ "G" , "B", "E" ], "E"); // Eaug chord
testChordRootIndex([ "G#" , "B", "E" ], "E"); // Eaug chord
