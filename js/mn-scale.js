require ("./mn-utils.js")

var ionian_sequence     = [2, 2, 1, 2, 2, 2, 1];
var hex_sequence        = [2, 2, 1, 2, 2, 3];
var pentatonic_sequence = [3, 2, 2, 3, 2];

var Scale = {
  diatonic:  ionian_sequence,
  ionian:    ionian_sequence,
  major:     ionian_sequence,
  dorian:    ionian_sequence.rotate(1),
  phrygian:  ionian_sequence.rotate(2),
  lydian:    ionian_sequence.rotate(3),
  mixolydian:         ionian_sequence.rotate(4),
  aeolian:   ionian_sequence.rotate(5),
  minor:     ionian_sequence.rotate(5),
  locrian:   ionian_sequence.rotate(6),
  hex_major6:         hex_sequence,
  hex_dorian:         hex_sequence.rotate(1),
  hex_phrygian:       hex_sequence.rotate(2),
  hex_major7:         hex_sequence.rotate(3),
  hex_sus:   hex_sequence.rotate(4),
  hex_aeolian:        hex_sequence.rotate(5),
  minor_pentatonic:   pentatonic_sequence,
  yu:        pentatonic_sequence,
  major_pentatonic:   pentatonic_sequence.rotate(1),
  gong:      pentatonic_sequence.rotate(1),
  egyptian:  pentatonic_sequence.rotate(2),
  shang:     pentatonic_sequence.rotate(2),
  jiao:      pentatonic_sequence.rotate(3),
  zhi:       pentatonic_sequence.rotate(4),
  ritusen:   pentatonic_sequence.rotate(4),
  whole_tone:         [2, 2, 2, 2, 2, 2],
  whole:     [2, 2, 2, 2, 2, 2],
  chromatic:          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  harmonic_minor:     [2, 1, 2, 2, 1, 3, 1],
  melodic_minor_asc:  [2, 1, 2, 2, 2, 2, 1],
  hungarian_minor:    [2, 1, 3, 1, 1, 3, 1],
  octatonic:          [2, 1, 2, 1, 2, 1, 2, 1],
  messiaen1:          [2, 2, 2, 2, 2, 2],
  messiaen2:          [1, 2, 1, 2, 1, 2, 1, 2],
  messiaen3:          [2, 1, 1, 2, 1, 1, 2, 1, 1],
  messiaen4:          [1, 1, 3, 1, 1, 1, 3, 1],
  messiaen5:          [1, 4, 1, 1, 4, 1],
  messiaen6:          [2, 2, 1, 1, 2, 2, 1, 1],
  messiaen7:          [1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  super_locrian:      [1, 2, 1, 2, 2, 2, 2],
  hirajoshi:          [2, 1, 4, 1, 4],
  kumoi:     [2, 1, 4, 2, 3],
  neapolitan_major:   [1, 2, 2, 2, 2, 2, 1],
  bartok:    [2, 2, 1, 2, 1, 2, 2],
  bhairav:   [1, 3, 1, 2, 1, 3, 1],
  locrian_major:      [2, 2, 1, 1, 2, 2, 2],
  ahirbhairav:        [1, 3, 1, 2, 2, 1, 2],
  enigmatic:          [1, 3, 2, 2, 2, 1, 1],
  neapolitan_minor:   [1, 2, 2, 2, 1, 3, 1],
  pelog:     [1, 2, 4, 1, 4],
  augmented2:         [1, 3, 1, 3, 1, 3],
  scriabin:  [1, 3, 3, 2, 3],
  harmonic_major:     [2, 2, 1, 2, 1, 3, 1],
  melodic_minor_desc: [2, 1, 2, 2, 1, 2, 2],
  romanian_minor:     [2, 1, 3, 1, 2, 1, 2],
  hindu:     [2, 2, 1, 2, 1, 2, 2],
  iwato:     [1, 4, 1, 4, 2],
  melodic_minor:      [2, 1, 2, 2, 2, 2, 1],
  diminished2:        [2, 1, 2, 1, 2, 1, 2, 1],
  marva:     [1, 3, 2, 1, 2, 2, 1],
  melodic_major:      [2, 2, 1, 2, 1, 2, 2],
  indian:    [4, 1, 2, 3, 2],
  spanish:   [1, 3, 1, 2, 1, 2, 2],
  prometheus:         [2, 2, 2, 5, 1],
  diminished:         [1, 2, 1, 2, 1, 2, 1, 2],
  todi:      [1, 2, 3, 1, 1, 3, 1],
  leading_whole:      [2, 2, 2, 2, 2, 1, 1],
  augmented:          [3, 1, 3, 1, 3, 1],
  purvi:     [1, 3, 2, 1, 1, 3, 1],
  chinese:   [4, 2, 1, 4, 1],
  lydian_minor:       [2, 2, 2, 1, 1, 2, 2]
}

scale = function(noteName, scaleName)
{
  var s = eval("Scale."+scaleName);
  var note = midinotefromname(noteName);
  var result = [];
  for (var interval of s)
  {
    result.push(note);
    note += interval;
  }
  return result;
}

