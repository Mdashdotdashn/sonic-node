require("./js/mn-sequence.js");
require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");
require("./js/mn-scale.js");
require("./js/mn-chord.js");
require("./js/mn-chordprogression.js");
require("./js/mn-note.js");
require("./js/mn-utils.js");

require("./chord-app.js");

{
//var rootNote = "c4"
//var scale = "major"
//var progression = [1, 5 ,4 , 1];
}

var rootNote = "c4"
var scale = "minor"
var progression = [1, 7 ,4 , 6, 1, 3, 6, 6];


// dumps some information about distance between inversions in the progression
var analyseProgression = function(sequence)
{
  console.log("chord sequence = " + JSON.stringify(sequence));
  console.log("analysing distances");

  var sum = 0;

  for (var index = 0; index < sequence.length; index++)
  {
    var next = index < sequence.length -1 ? index + 1 : 0;
    var distance = chordSequence[next].distanceFrom(chordSequence[index]);
    console.log(index + "->" + next + ":" + distance);
    console.log(chordname(chordSequence[index].notes_));
    sum += Math.abs(distance);
  }

  console.log("entropy = " + sum);
}


//-------------------------------------------------------------------

//var cp = new ChordProgression(rootNote, scale);
//var chordSequence = makeChordSequence(rootNote, scale, progression);

var chordSequence = makeChordSequence(["a","cm"]);
chordSequence[0].invert(0);

analyseProgression(chordSequence);


var app = new ChordApp({
  sequence: chordSequence,
  resolution: 64,
  rectify: 2,
  device: "iac",
  tempo: 72,
});
console.log(JSON.stringify(app));
app.run();



