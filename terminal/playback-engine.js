require("./notestream-output.js")
require("../js/mn-midi-device.js");
require("../js/sequencing/sequencing.js");

Track = function()
{
  this.player_ = null;
  this.stream_ = null;
}

Track.prototype.init = function(device, channel)
{
  this.stream_ = new NoteStreamOutput(device, channel);
}

Track.prototype.tick = function(position)
{
  this.stream_.tick();
}

// Note evnet has a pitck, (velocity) and legnth

Track.prototype.queueNotes = function(noteEventList)
{
  noteList.forEach(function(midinote) {
       this.stream_.add(midinote,gateLength);
    });
}
//------------------------------------------------------------------------------

PlaybackEngine = function()
{
  this.tracks_ = [];
  this.ticksPerBeat_ = kTicksPerBeats;
  this.signature_ = new Signature();
  this.tempo_ = 120
}

PlaybackEngine.prototype.init = function(deviceName)
{
  var device = MidiDevice.find(deviceName);
  if (device)
  {
    for (var i = 0; i < 4; i++)
    {
      var track = new Track();
      track.init(device, i);
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
