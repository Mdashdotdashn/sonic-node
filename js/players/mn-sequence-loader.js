require("../data/mn-sequence-data.js")

var ConvertSequenceData = function(data, signatureString, ticksPerBeat)
{
  var signature = new Signature(signatureString);

  sequenceTimeline = new Timeline();
  sequenceTimeline.sequence = data.sequence.map(function(element)
  {
    var position = convertToPosition(element.position, signature, ticksPerBeat);
    return { position: position, element: element.degrees };
  });

  sequenceTimeline.setLength(convertToPosition(data.length, signature, ticksPerBeat));
  return sequenceTimeline;
}

SequenceLoader = function(ticksPerBeat)
{
  this.dataStore_ = sequenceDataStore;
  this.ticksPerBeat_ = ticksPerBeat;
}

SequenceLoader.prototype.load = function(name)
{
  var result;
  var ticksPerBeat = this.ticksPerBeat_;

  this.dataStore_.forEach(function(sequenceData){
      if (sequenceData.name == name)
      {
        result = ConvertSequenceData(sequenceData.data, sequenceData.signature, ticksPerBeat);
      }
  })
  return result;
}

SequenceLoader.prototype.listSequences = function()
{
  var result = [];
  this.dataStore_.forEach(function(sequenceData){
    result.push(sequenceData.name);
  });
  return result;
}
