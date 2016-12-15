// Computes the center of gravity for a group of notes

var note_gravity_center = function(notes)
{
  var sum = 0.0;
  notes.forEach(function(note)
    {
      sum += note;
    });
  return sum / notes.length;
}

// Computes the distance between two chords

var computeDistance = function(noteList1, noteList2)
{
  return note_gravity_center(noteList2) - note_gravity_center(noteList1);
}

//------------------------------------------------------------

var rectify_closest = function(noteListFrom, noteListTo)
{
  var d = computeDistance(noteListFrom, noteListTo);
  var sign = Math.sign(d);
  d = Math.abs(d);
  var mind = 1000;

  var result = noteListTo;

  while(mind > d)
  {
    mind =d;
    result = invertChord(result, -sign);
    d = Math.abs(computeDistance(noteListFrom, result));
  }
  result = invertChord(result, sign);
  return result;
}

var rectify_progression_sequential = function(sequence)
{
  for (var i = 0; i < sequence.length-1; i++)
  {
    sequence[i+1].notes = rectify_closest(sequence[i].notes,sequence[i+1].notes);
  }
}

var rectify_progression_to_first = function(sequence)
{
  for (var i = 0; i < sequence.length-1; i++)
  {
    sequence[i+1].notes = rectify_closest(sequence[0].notes,sequence[i+1].notes);
  }
}

var rectify_progression_inwards = function(sequence)
{
  var leftIndex = 1;
  var rightIndex = sequence.length -1;

  sequence[rightIndex].notes = rectify_closest(sequence[0].notes, sequence[rightIndex].notes);
  rightIndex--;

  while (leftIndex < rightIndex)
  {
    sequence[leftIndex].notes = rectify_closest(sequence[leftIndex -1].notes, sequence[leftIndex].notes);
    if (rightIndex > leftIndex)
    {
      sequence[rightIndex].notes = rectify_closest(sequence[rightIndex+1].notes, sequence[rightIndex].notes);
    }
    rightIndex--;
    leftIndex++;
  }
}

rectify_progression = function(sequence, mode)
{
  switch(mode)
  {
    case 0:
      break;
    case 1:
      rectify_progression_sequential(sequence);
      break;
    case 2:
      rectify_progression_to_first(sequence);
      break;
    case 3:
      rectify_progression_inwards(sequence);
      break;
  }
}
