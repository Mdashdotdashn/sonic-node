
TransformationLoader = function()
{
  this.dataStore = new Object;
  this.dataStore["legato"] = new STLegato();
  this.dataStore["speed"] = new STSpeed();
}

TransformationLoader.prototype.load = function(name, parameters)
{
  if (this.dataStore[name])
  {
    return _.clone(this.dataStore[name]);
  }
}
