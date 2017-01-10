_ = require("lodash");

//------------------------------------------------------------------------------

// change the toPath property of the item by applying fn to the fromPath

var applyFn = (item, srcPath, dstPath, fn) => {
  let srcData = _.get(item, [_.toPath(srcPath)]);
  let dstData = fn(srcData);
  return _.set(_.clone(item), _.toPath(dstPath), dstData);
}

//------------------------------------------------------------------------------
//
// apply a generic transform to the timelne elements
//

var applyTransform = (timeline, srcPath, dstPath, fn) => {
  newTimeline = new Timeline();
  newTimeline.sequence = timeline.sequence.map(item => applyFn(item, srcPath,dstPath, fn));
  newTimeline.setLength(timeline.length);
  return newTimeline;
}

//------------------------------------------------------------------------------

STSpeed = function()
{
  this.amount = 1;
}

STSpeed.prototype.setParameters = function(parameters)
{
  _.extend(this,parameters);
}

STSpeed.prototype.process = function(timeline)
{
  var convertPositionFn = (x) => { console.log(ticksFromPosition(x)); return createSequencingPosition(ticksFromPosition(x) * 100 / this.amount, x.ticksPerBeat_)};
  var newTimeline = applyTransform(timeline, "position", "position", (x) => convertPositionFn(x));
  newTimeline.length = convertPositionFn(newTimeline.length);
  return newTimeline;
}

//------------------------------------------------------------------------------

STLegato = function()
{
  this.amount = 70;
}

STLegato.prototype.setParameters = function(parameters)
{
  _.extend(this,parameters);
}

STLegato.prototype.process = function(timeline)
{
  // Generate a an array with the note's position in ticks

  var timestampInTicks = _(timeline.sequence)
    .map(item => ticksFromPosition(item.position))
    .uniq()
    .value();
  timestampInTicks.push(ticksFromPosition(timeline.length));

  // compute the length each step shoud be
  var lengthArray = _(timestampInTicks)
    .map((value, index, array) => array[(index+1) % array.length] - value)  // Get the length of each step by diffence to the next
    .map((value) => Math.max(Math.floor(value * (this.amount / 100)),1)) // Apply amount
    .value()

  // build a position => length map
  let lengthMap = _.zipObject(timestampInTicks, lengthArray);

  // apply the postion -> length mapping
  return applyTransform(timeline, "position", "element.length", (x) => lengthMap[ticksFromPosition(x)]);
}

//------------------------------------------------------------------------------
SequenceTransformationStack = function()
{
  this.reset();
}

SequenceTransformationStack.prototype.reset = function()
{
  this.stack_ = [];
}

SequenceTransformationStack.prototype.add = function(transformation)
{
  this.stack_.push(transformation);
}

SequenceTransformationStack.prototype.process = function(timeline)
{
  return this.stack_.reduce(function(timeline, transformation)
  {
    return transformation.process(timeline);
  }, timeline);
}
