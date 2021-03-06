require("../js/midi/midi.js")
require("../js/sequencing/sequencing.js");
require("../js/players/players.js");

//------------------------------------------------------------------------------

Track = function()
{
  this.player_ = null;
  this.stream_ = null;
}

Track.prototype.init = function(device, channel)
{
  this.stream_ = new NoteStreamOutput(device, channel);
}

Track.prototype.setPlayer = function(player)
{
  player.init(this.stream_);
  this.player_ = player;
}

Track.prototype.tick = function(position)
{
  if (this.player_)
  {
    this.player_.tick(position);
  }
  this.stream_.tick();
}

Track.prototype.setHarmonicTimeline = function(rootNote, timeline)
{
    if (this.player_)
    {
      this.player_.setHarmonicTimeline(rootNote, timeline);
    }
}

//------------------------------------------------------------------------------

PlaybackEngine = function()
{
  this.tracks_ = [];
  this.ticksPerBeat_ = kTicksPerBeats;
  this.signature_ = new Signature();
  this.tempo_ = 120;
}

PlaybackEngine.prototype.init = function(deviceName)
{
  var device = MidiDevice.find(deviceName);
  if (!device)
  {
    throw new Error("No midi device");
  }
  if (device)
  {
    for (var i = 0; i < 4; i++)
    {
      var track = new Track();
      track.init(device, i);
      var player = new SequencePlayer(this.signature_, this.ticksPerBeat_);
      track.setPlayer(player);
      this.tracks_.push(track);
    }
  }


  this.heartbeat_ = new Heartbeat(this.ticksPerBeat_);
	this.heartbeat_.setTempo(this.tempo_);

  this.beatTimeSource_ = new BeatTimeSource(this.ticksPerBeat_);
  this.heartbeat_.connect(this.beatTimeSource_);
  this.beatTimeSource_.connect(this);
}

PlaybackEngine.prototype.run = function()
{
  this.heartbeat_.run();
}

PlaybackEngine.prototype.setChordSequence = function(rootNote, timeline)
{
  // send to all tracks
  this.tracks_.forEach(function(track){
    track.setHarmonicTimeline(rootNote, timeline);
  })
}

PlaybackEngine.prototype.getPlayer = function(index)
{
  return this.tracks_[index].player_;
}

PlaybackEngine.prototype.tick = function(position)
{
/*	if (position.ticks_ == 0)
	{
		var beatCount = position.beats_;
    var beatPerMeasure =  this.signature_.numerator;
		console.log(Math.floor(beatCount / beatPerMeasure + 1) + "." + (beatCount % beatPerMeasure + 1) + "." + (position.sixteenth_ + 1));
	}*/

  this.tracks_.forEach(function(track){
    track.tick(position);
  })
}

PlaybackEngine.prototype.setSignature = function(signature)
{
  this.signature_ = signature;
}

PlaybackEngine.prototype.setTempo = function(tempo)
{
  this.heartbeat_.setTempo(tempo);
}
