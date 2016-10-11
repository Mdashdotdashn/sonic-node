var assert = require("assert");

require("../js/mn-chord.js");
require("../js/mn-note.js");
require("../js/mn-scale.js");
require("../js/mn-chordprogression.js");

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
console.log(chordList);
var result = scalesFromChords(chordList);
console.log(result);
