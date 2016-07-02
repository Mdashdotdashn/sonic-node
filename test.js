require("./js/mn-sequence.js");
require("./js/mn-midi-device.js");
require("./js/mn-heartbeat.js");
require("./js/mn-scale.js");
require("./js/mn-chordprogression.js");
require("./js/mn-note.js");
require("./js/mn-utils.js");

{
var rootNote = "c4"
var scale = "major"
var progression = [1, 5 ,4 , 1];
}

var rootNote = "c4"
var scale = "minor"
var progression = [1, 7 ,4 , 6, 1, 3, 6, 6];


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
    sum += Math.abs(distance);
  }

  console.log("entropy = " + sum);
}

function rectify_closest(from, to)
{
  var d = to.distanceFrom(from);
  var sign = Math.sign(d);
  d = Math.abs(d);
  var mind = 1000;

  while(mind > d)
  {
    mind =d;
    to.invert(-sign);
    d = Math.abs(to.distanceFrom(from));
  }
  to.invert(sign);
  return to;
}

function rectify_progression_sequential(sequence)
{
  for (var i = 0; i < sequence.length-1; i++)
  {
    sequence[i+1] = rectify_closest(sequence[i],sequence[i+1]);
  }
}

function rectify_progression_to_first(sequence)
{
  for (var i = 0; i < sequence.length-1; i++)
  {
    sequence[i+1] = rectify_closest(sequence[0],sequence[i+1]);
  }
}

function rectify_progression(sequence)
{
  var leftIndex = 1;
  var rightIndex = sequence.length -1;

  sequence[rightIndex--] = rectify_closest(sequence[0], sequence[rightIndex]);

  while (leftIndex < rightIndex)
  {
    sequence[leftIndex] = rectify_closest(sequence[leftIndex -1], sequence[leftIndex]);
    leftIndex++;
    if (rightIndex > leftIndex)
    {
      sequence[rightIndex] = rectify_closest(sequence[rightIndex+1], sequence[rightIndex]);
      rightIndex--;
    }
  }
}

//-------------------------------------------------------------------

var cp = new ChordProgression(rootNote, scale);
var chordSequence = [];
progression.forEach(function(degree) {
  chordSequence.push(cp.chord(degree));
  });

chordSequence[0].invert(-2);

rectify_progression_to_first(chordSequence);

analyseProgression(chordSequence);

//-------------------------------------------------------------------

var device = MidiDevice.find("Through");
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


