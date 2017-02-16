require("../js/sequencing/sequencing.js")

var assert = require("assert");

function testAdd(b1,s1,t1,b2,s2,t2,br,sr,tr)
{
  var pos1 = new SequencingPosition(kTicksPerBeats);
  var pos2 = new SequencingPosition(kTicksPerBeats);

  pos1.beats_ = b1;
  pos1.sixteenth_ = s1;
  pos1.ticks_ = t1;

  pos2.beats_ = b2;
  pos2.sixteenth_ = s2;
  pos2.ticks_ = t2;

  var result = addPositions(pos1, pos2);
  assert.equal(result.beats_, br);
  assert.equal(result.sixteenth_, sr);
  assert.equal(result.ticks_, tr);
}

function testSub(b1,s1,t1,b2,s2,t2,br,sr,tr)
{
  var pos1 = new SequencingPosition(kTicksPerBeats);
  var pos2 = new SequencingPosition(kTicksPerBeats);

  pos1.beats_ = b1;
  pos1.sixteenth_ = s1;
  pos1.ticks_ = t1;

  pos2.beats_ = b2;
  pos2.sixteenth_ = s2;
  pos2.ticks_ = t2;

  var result = subPositions(pos1, pos2);
  assert.equal(result.beats_, br);
  assert.equal(result.sixteenth_, sr);
  assert.equal(result.ticks_, tr);
}

function testCompare(b1,s1,t1,b2,s2,t2,result)
{
  var pos1 = new SequencingPosition(kTicksPerBeats);
  var pos2 = new SequencingPosition(kTicksPerBeats);

  pos1.beats_ = b1;
  pos1.sixteenth_ = s1;
  pos1.ticks_ = t1;

  pos2.beats_ = b2;
  pos2.sixteenth_ = s2;
  pos2.ticks_ = t2;

  assert.equal(comparePositions(pos1, pos2), result);
}

function testStringConversion(s,br,sr,tr)
{
  var result = convertToPosition(s, new Signature, kTicksPerBeats);
  assert.equal(result.beats_, br);
  assert.equal(result.sixteenth_, sr);
  assert.equal(result.ticks_, tr);
}

function testToString(br,sr,s)
{
  var position = new SequencingPosition(kTicksPerBeats);
  position.beats_ = br;
  position.sixteenth_ = sr;
  assert.equal(s, positionToString(position, new Signature));
}

function testMax(b1,s1,t1,b2,s2,t2,br,sr,tr)
{
  var pos1 = new SequencingPosition(kTicksPerBeats);
  var pos2 = new SequencingPosition(kTicksPerBeats);

  pos1.beats_ = b1;
  pos1.sixteenth_ = s1;
  pos1.ticks_ = t1;

  pos2.beats_ = b2;
  pos2.sixteenth_ = s2;
  pos2.ticks_ = t2;

  var result = maxPositions(pos1, pos2);
  assert.equal(result.beats_, br);
  assert.equal(result.sixteenth_, sr);
  assert.equal(result.ticks_, tr);
}

testStringConversion("1.1.1",0,0,0);
testStringConversion("2.1.1",4,0,0);

testToString(4,1,"2.1.2.1");

testAdd(1,1,0, 3,3,1, 5,0,1);

testSub(3,3,0, 1,1,1, 2,1,5);

testCompare(1,1,0, 3,3,1, -1);
testCompare(2,1,0, 2,1,0, 0);
testCompare(3,3,1, 1,1,0, 1);

testMax(3,3,1, 1,1,0, 3,3,1);
