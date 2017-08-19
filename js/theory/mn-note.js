
var notenames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

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

intervalfromnotename = function(notename)
{
  var needle = notename.toUpperCase();

  for (var index = 0; index < notenames.length; index++)
  {
    if (needle === notenames[index])
    {
      return index;
    }
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
  notemap[notename(midinote)] = midinote;
}

n = function(name)
{
  return notemap[name];
}

// Given a note name (with octave, e.g. D4), returns the midi note number

midinotefromname = function(name)
{
  return notemap[name.toUpperCase()];
}
