var _ = require('lodash');

kTicksPerBeats = 24; // Equivalent to midi clock

CHECK_TYPE = function(value, expectedType)
{
  var objectType = typeof value;
  var valid = (objectType === "object") ? (value instanceof expectedType) : (objectType === expectedType);
  if (!valid)
  {
    console.log("while checking ");
    throw TypeError("Expecting a " + expectedType + " but got " + JSON.stringify(value));
  }
  return true;
}

//------------ Time signature ---------------------------

Signature = function()
{
  this.numerator = 4;
  this.denominator = 4;
}


//------------ Time line --------------------------------
// Used to remember elements located to a given position
// It can have two forms:
// 1: compacted where the sequence is a map
// whose key is the position and value an array of items
// 2: expanded where the sequence is an array of elements
//    { position: , element: }

Timeline = function()
{
  this.sequence = [];
}

Timeline.prototype.add = function(element, position)
{
  CHECK_TYPE(position, SequencingPosition);
  this.sequence.push({
    position: position,
    element: element,
  })
}

Timeline.prototype.setLength = function(length)
{
  CHECK_TYPE(length, SequencingPosition);
  this.length = length;
}

Timeline.prototype.expand = function()
{
  var timeline = new Timeline();
  timeline.length = this.length;
  timeline.sequence =  _.flatMap(this.sequence,function(item)
        {
          var position = item.position;
          CHECK_TYPE(item.element,Array);
          var expanded = item.element.map(function(e)
          {
            return {
               position: position,
                 element: e
                };
          })
          return expanded;
        });
    return timeline;
}

// compact and sort an expanded timiline

Timeline.prototype.compact = function()
{
  var timeline = new Timeline();
  timeline.length = this.length;
  var ticksPerBeat = timeline.length.ticksPerBeat_;

  this.sequence.sort((a,b) => comparePositions(a.position,b.position));

  var timemap = this.sequence.reduce(function(map,item)
  {
    var key = ticksFromPosition(item.position);
    var value = item.element;
    if (!map[key])
    {
      map[key] = new Array;
    }
    map[key].push(value);
    return map;
  }, {});

  timeline.sequence = _.map(timemap, function(value, key){
      return {
        position: createSequencingPosition(parseInt(key), ticksPerBeat),
        element: value
      }
  })
  return timeline;
}

mergeTimeline = function(t1, t2)
{
  var expT1 = t1.expand();
  var expT2 = t2.expand();

  var timeline = new Timeline();
  timeline.setLength(maxPositions(expT1.length, expT2.length));
  timeline.sequence = _.union(expT1.sequence, expT2.sequence);
  return timeline.compact();
}

createTimeline = function(elements, positionOffset)
{
  CHECK_TYPE(positionOffset, SequencingPosition);
  var ticksPerBeat = positionOffset.ticksPerBeat_;

  var current = new SequencingPosition(ticksPerBeat);
  var timeline = new Timeline();

  elements.forEach(function(element){
    timeline.add(element, current);
    current = addPositions(current, positionOffset);
  })

  timeline.length = current;
  return timeline;
}
