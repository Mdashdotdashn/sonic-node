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

function testChordRootIndex(noteList, expectedRootNote)
{
  var expectedRootIndex = indexfromnotename(expectedRootNote);
  var chordRootIndex = rootofchord(convertToMidiNote(noteList));
  assert.equal(chordRootIndex, expectedRootIndex);
}

testChordRootIndex([ "B" , "G", "D" ], "G"); // G chord
testChordRootIndex([ "G" , "B", "E" ], "E"); // Eaug chord
testChordRootIndex([ "G#" , "B", "E" ], "E"); // Eaug chord
