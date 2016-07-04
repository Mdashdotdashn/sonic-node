require("./js/mn-sequence.js");
require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");
require("./js/mn-scale.js");
require("./js/mn-chordprogression.js");
require("./js/mn-note.js");
require("./js/mn-utils.js");

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

var cp = new ChordProgression(rootNote, scale);
var chordSequence = [];
progression.forEach(function(degree) {
  chordSequence.push(cp.chord(degree));
  });

chordSequence[0].invert(0);

rectify_progression(chordSequence, 2);

analyseProgression(chordSequence);

chordSequence.forEach(function(chord)
  {
      console.log(chordname(chord.notes_));
  });
//-------------------------------------------------------------------

var device = MidiDevice.find("iac");
//var device = MidiDevice.find("circuit");
var output = device.getOutput(0);

var noteStream = new NoteStream();

var sequence = new StepSequence(16);
sequence.setContent(chordSequence);

var heartbeat = new Heartbeat();

heartbeat.connect(sequence);
heartbeat.connect(function()
  {
    output.sendSync();
    noteStream.tick();
  });

sequence.connect(function(step)
  {
    if (device)
    {
      console.log(chordname(step.notes_));
      step.notes_.forEach(function(note) {
          noteStream.add(note,24);
        });
    }
  });

noteStream.connect(function(noteEvent)
  {
    if (output)
    {
      if (noteEvent.gate)
      {
        output.sendNoteOn(noteEvent.note, noteEvent.velocity * 127);
      }
      else
      {
        output.sendNoteOff(noteEvent.note);
      }
    }
    else
    {
      console.log(noteEvent);
    }
  });
heartbeat.run();
output.sendStart();


