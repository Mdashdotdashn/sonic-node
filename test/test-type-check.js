var assert = require("assert");
require("../js/sequencing/sequencing.js");

var p = new SequencingPosition(kTicksPerBeats);
assert(CHECK_TYPE(p, SequencingPosition));
