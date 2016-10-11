var assert = require("assert");

require("../js/mn-chord.js");
require("../js/mn-note.js");

function testChordName(noteList, expectedChord)
{
  var midiNotes = [];
  noteList.forEach(function(noteName)
  {
    midiNotes.push(midinotefromname(noteName + "4"));
  });

  var chordName = chordname(midiNotes);
  assert.equal(chordName,expectedChord.toLowerCase());
}

testChordName([ "G" , "E", "C"], "c");
testChordName([ "G" , "D#", "C"], "Cm");
