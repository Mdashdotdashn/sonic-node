require("./notestream-output.js")
require("../js/mn-midi-device.js");
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
  noteList.forEach(function(note) {
       stream.add(note.pitch, note.velocity, gateLength);
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
    var player = new SequencePlayer(this.signature_, this.ticksPerBeat_);
    var baseSequence = {
        length : "1.4.1",
        sequence:
          [
            { position: "1.1.1", degrees: [{d:1, t:-12}, 1,2]},
            { position: "1.1.3", degrees: [{d:1, t:-12}]},
            { position: "1.2.1", degrees: [2]},
            { position: "1.2.3", degrees: [{d:1, t:-12}]},
            { position: "1.3.1", degrees: [3,1]},
            { position: "1.3.3", degrees: [{d:1, t:-12}]},
          ]
        }
    player.setSequence(baseSequence);
    this.tracks_[0].setPlayer(player);
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
  // build a timeline

  var currentBar = 0;
  var timeline = new Timeline;
  var signature = this.signature_;
  var ticksPerBeat = this.ticksPerBeat_;

  var ticksPerBar = ticksPerBeat * signature.numerator;

  harmonicProgression.forEach(function(element)
  {
    var position = createSequencingPosition(currentBar * ticksPerBar, ticksPerBeat);
    timeline.add(element,position);
    currentBar++;
  })
  timeline.setLength (createSequencingPosition(currentBar * ticksPerBar, ticksPerBeat));

  // send to all tracks
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

PlaybackEngine.prototype.setSignature = function(signature)
{
  this.signature_ = signature;
}
