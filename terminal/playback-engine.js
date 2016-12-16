require("./notestream-output.js")
require("../js/mn-midi-device.js");
require("../js/sequencing/sequencing.js");

//------------------------------------------------------------------------------

var ChordPlayer = function()
{
  this.timeline_ = null;
}

ChordPlayer.prototype.init = function(noteQueuer)
{
  this.noteQueuer_ = noteQueuer;
}

ChordPlayer.prototype.render = function(timeline)
{
  this.timeline_ = timeline;
}

ChordPlayer.prototype.tick = function(position)
{
  if (this.timeline_)
  {
    var wrapped = position;
    wrapped.beats_ %= this.timeline_.length_;
    var noteQueuer = this.noteQueuer_;

    this.timeline_.sequence_.forEach(function(step){
      if ((step.position.beats_ == wrapped.beats_)
      &&(step.position.sixteenth_ == wrapped.sixteenth_)
      &&(step.position.ticks_ == wrapped.ticks_))
      {
        noteQueuer.queueNotes(step.element.voiced);
      }
    })
  }
}
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
  player.init(this);
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

Track.prototype.render = function(timeline)
{
    if (this.player_)
    {
      this.player_.render(timeline);
    }
}

// Note evnet has a pitck, (velocity) and legnth

Track.prototype.queueNotes = function(noteList)
{
  var gateLength = 24 * 2;
  var stream = this.stream_;
        console.log("queing " + JSON.stringify(noteList));
  noteList.forEach(function(midinote) {
       stream.add(midinote,0.1, gateLength);
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
      this.tracks_.push(track);
    }
    this.tracks_[0].setPlayer(new ChordPlayer());
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

PlaybackEngine.prototype.setChordSequence = function(harmonicProgression)
{
  var currentBar = 1;
  var timeline = new Object;
  var signature = this.signature_;

  timeline.sequence_ = [];
  harmonicProgression.forEach(function(element)
  {
    var position = new SequencingPosition(this.ticksPerBeat_);
    position.beats_ = (currentBar - 1) * signature.denominator;
    timeline.sequence_.push({
      position : position,
      element : element
    });
    currentBar++;
  })
  timeline.length_ = (currentBar - 1) * signature.denominator;
  this.tracks_.forEach(function(track){
    track.render(timeline);
  })
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
