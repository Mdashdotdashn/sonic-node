var NanoTimer = require("nanotimer");

var STickHeartBeat = function(heartbeat)
{
  heartbeat.tick();
}

Heartbeat = function()
{
    this.tempo = 140;
    this.timer = new NanoTimer();
    this.tickers = new Array();
}

Heartbeat.prototype.addTicker = function(ticker)
{
  this.tickers.push(ticker);
}

Heartbeat.prototype.tick = function()
{
  for (var ticker of this.tickers)
  {
    ticker.tick();
  }
}

Heartbeat.prototype.run = function()
{
  this.timer.setInterval(function(hb) { hb.tick();}, [this], '2s');        	
}
