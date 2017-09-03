// returns the chord type from the given interval list

chordTypeFromIntervalList = function (intervalList)
{
  // We need to recover the chord type from the interval list.
  // Since tonal list the result from (C->B) in the case there's several options
  // we first re-root the progression so the first interval is 1P
  var backToRoot = "-" + intervalList[0];
  transposed = intervalList.map(tonal.transpose(backToRoot));
  notes = tonal.harmonize(transposed, 'C');
  detected = tonal.chord.detect(notes);
  parsed = tonal.chord.parse(detected[0]);
  return parsed.type === "M" ? "" : parsed.type;
}
