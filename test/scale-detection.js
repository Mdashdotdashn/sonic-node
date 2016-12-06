var assert = require("assert");

require("../js/theory/mn-chords.js");
require("../js/mn-note.js");
require("../js/mn-scale.js");

// let's perpare some data

function makeChordList()
{
  var rootNote = "c4";
  var scale = "major";
  var progression = [1,5];

  var chordSequence = makeChordProgression(rootNote, scale, progression);
  var chordList = [];

  chordSequence.forEach(function (chord)
  {
    chordList.push(chordname(chord.notes_));
  })
  return chordList;
}

//var chordList = makeChordList();
var chordList = ["cm", "a#", "fm", "g#"];
var result = scalesFromChords(chordList);

assert.equal(result.score_, 1);
assert.equal(result.scaleList_.length, 1);
assert.equal(result.scaleList_[0], "c minor");
