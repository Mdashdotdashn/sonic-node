require("../js/mn-sequence.js");
require("../js/mn-midi-device.js");
require("../js/mn-heartbeat.js");
require("../js/mn-scale.js");
require("../js/mn-chord.js");
require("../js/mn-chordprogression.js");
require("../js/mn-note.js");
require("../js/mn-utils.js");

var scale = "minor";
var rootNote = "d3";

var extend = require("extend")
var peg = require("pegjs");
var fs = require('fs');

var Application = function()
{

	fs.readFile( __dirname + '/grammar.txt', function (err, data) {
	  if (err) {
	    throw err; 
	  }
	  this.parser = peg.buildParser(data.toString());

	});
}

Application.prototype.init = function(options) {
	var parameters =
	{
		sequence: [],
		rectify: 0,
		device: "",
		tempo: 120,
		resolution: 16,  // In sixteenth
		length: 0.5,      // percentage
	}

	extend(parameters, options);

	if (parameters.rectify > 0)
	{
		rectify_progression(parameters.sequence, parameters.rectify - 1);
	}

	this.sequence_ = parameters.sequence;

	if (parameters.device.trim())
	{
		var device = MidiDevice.find(parameters.device);
		if (device)
		{
			this.output_ = device.getOutput(0);
		}
	}

	this.resolution_ = parameters.resolution;

	this.gateLength_ = parameters.length * 6 * parameters.resolution;
	this.tempo_ = parameters.tempo;

};

Application.prototype.start = function()
{
	var noteStream = new NoteStream();

	this.sequencer_ = new StepSequence(this.resolution_);
	this.sequencer_.setContent(this.sequence_);

	var heartbeat = new Heartbeat();
	var output = this.output_;
	var gateLength = this.gateLength_;

	heartbeat.setTempo(this.tempo_);
	heartbeat.connect(this.sequencer_);
	heartbeat.connect(function()
	  {
	    output.sendSync();
	    noteStream.tick();
	  });

	this.sequencer_.connect(function(step)
	  {
	      console.log(chordname(step.notes_));
	      step.notes_.forEach(function(note) {
	          noteStream.add(note,gateLength);
	        });
	  });

	noteStream.connect(function(noteEvent)
	  {
	    if (output)
	    {
	      if (noteEvent.gate)
	      {
	        output.sendNoteOn(noteEvent.note, noteEvent.velocity * 127);
	      }
	      else
	      {
	        output.sendNoteOff(noteEvent.note);
	      }
	    }
	    else
	    {
	      console.log(noteEvent);
	    }
	  });
	heartbeat.run();

//	this.output_.sendStart();
}

Application.prototype.parse = function(command) 
{
	var result = parser.parse(command.toLowerCase());
	var chords = JSON.parse("[" + result + "]");
	var chordSequence = makeChordProgression(rootNote, scale, chords);
	chordSequence[0].invert(0);
	console.log(chordSequence);

	this.sequencer_.setContent(chordSequence);
};

module.exports = new Application();

