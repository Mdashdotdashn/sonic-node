require("../data/mn-sequence-data.js")

SequenceLoader = function()
{
  this.dataStore = sequenceDataStore;
}

SequenceLoader.prototype.load = function(name)
{
  var result;
  sequenceDataStore.forEach(function(sequenceData){
      if (sequenceData.name == name)
      {
        result = sequenceData.data;
      }
  })
  return result;
}

SequenceLoader.prototype.listSequences = function()
{
  var result = [];
  sequenceDataStore.forEach(function(sequenceData){
    result.push(sequenceData.name);
  });
  return result;
}
