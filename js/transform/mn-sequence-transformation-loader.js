
TransformationLoader = function()
{
  this.dataStore = new Object;
  this.dataStore["legato"] = new STLegato();
}

TransformationLoader.prototype.load = function(name, parameters)
{
  if (this.dataStore[name])
  {
    return _.clone(this.dataStore[name]);
  }
}
