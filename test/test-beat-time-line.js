var assert = require("assert");
var _ = require("lodash");
require("../js/sequencing/sequencing.js");
require("../js/mn-utils.js");

var elements = [ [1,2],[3],[6,7]]
var beat = createSequencingPosition(kTicksPerBeats, kTicksPerBeats);
var timeline = createTimeline(elements, beat);

var expanded = timeline.expand();
assert.equal(expanded.sequence.length, 5);
var compacted = expanded.compact();
assert.deepEqual(compacted, timeline);
