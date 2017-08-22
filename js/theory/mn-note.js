
var notenames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

var noteArray = [
  ["C", "B#"],
  ["C#", "Db"],
  ["D"],
  ["D#", "Eb"],
  ["E", "Fb"],
  ["F", "E#"],
  ["F#", "Gb"],
  ["G"],
  ["G#", "Ab"],
  ["A"],
  ["A#", "Bb"],
  ["B", "Cb"],
];

// Returns the note name from the given interval/index
// this is not per se a degree since it's the index from C

notefromdegree = function(interval)
{
  if (interval < 0)
  {
    interval = 12 + interval%12;
  }
  else
  {
    interval = interval%12;
  }
  return notenames[interval];
}

// Given a note name, eturns the note index from C

indexfromnotename = function(notename)
{
  var needle = notename.toUpperCase();

  var index = 0;
  for (var aliases of noteArray)
  {
    for(var name of aliases)
    {
      if (name.toUpperCase() == needle)
      {
        return index;
      }
    }
    index++;
  }
}

// Given a midi note number, returns the note name (with octave - e.g E5)

notename = function(midinote)
{
  var note = midinote % 12;
  octave = (midinote - note) / 12 - 1;
  return notenames[note] + octave;
}

var notemap = {};

for (var midinote = 0; midinote < 128; midinote++)
{
  var index = midinote % 12;
  octave = (midinote - index) / 12 - 1;
  for (name of noteArray[index])
  {
    notename = name + octave;
    notemap[notename.toLowerCase()] = midinote;
  }
}

n = function(name)
{
  return notemap[name.toLowerCase()];
}

// Given a note name (with octave, e.g. D4), returns the midi note number

midinotefromname = function(name)
{
  var lowNote = name.toLowerCase();
  var note = parseInt(notemap[lowNote]);
  var s = name.substring(0,2);
  if (s == "cb")
  {
    note -= 12;
  }
  else
  {
    if (s == "b#")
    {
      note +=12;
    }
  }
  return note;
}
