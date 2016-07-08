require("../js/mn-sequence.js");
require("../js/mn-midi-device.js");
require("../js/mn-heartbeat.js");
require("../js/mn-scale.js");
require("../js/mn-chord.js");
require("../js/mn-chordprogression.js");
require("../js/mn-note.js");
require("../js/mn-utils.js");

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

	this.progression_ = [];
	this.scale_ = "major";
	this.rootNote_ = "c3";
	this.inversion_ = 0;
	this.rectificationMethod_ = 0;

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
	        output.sendNoteOn(noteEvent.note, noteEvent.velocity);
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

Application.prototype.updateSequence = function()
{
	if (this.progression_.length != 0)
	{
		var chordSequence = makeChordProgression(this.rootNote_, this.scale_, this.progression_);
		chordSequence[0].invert(this.inversion_);
		rectify_progression(chordSequence, this.rectificationMethod_);
		this.sequencer_.setContent(chordSequence);
	}
	else
	{
		this.sequencer_.setContent([]);
	}
}

Application.prototype.currentSequenceString = function()
{
	var chordnameList = "Chord sequence: ";
	var chordSequence = this.sequencer_.getContent();
	chordSequence.forEach(function (chord)
	{
		chordnameList += chordname(chord.notes_) + ",";
	})
	return chordnameList;
}

Application.prototype.parse = function(command) 
{
	var result = parser.parse(command.toLowerCase()); // returns something like a function call: method, arg1, arg2, arg3
	console.log("executing: " + JSON.stringify(result));
	return this[result.method](result.arguments);
};

Application.prototype.exit = function(arguments)
{
	process.exit();
	return "Bye, dave";
}

Application.prototype.setScale = function(arguments)
{
	this.scale_ = arguments.scale;
	this.rootNote_ = arguments.root+"3";
	this.updateSequence();

	var scaleChords = makeChordProgression(this.rootNote_, this.scale_, [1,2,3,4,5,6,7]);

	scaleChordsNameList = "";
	scaleChords.forEach(function (chord)
	{
		scaleChordsNameList += chordname(chord.notes_) + ",";
	})

	return "Scale chords: " + scaleChordsNameList + "\n" + this.currentSequenceString();
}

Application.prototype.setResolution = function(argument)
{
	this.sequencer_.setResolution(argument);
	return this.currentSequenceString();
}

Application.prototype.setRectification = function(argument)
{
	console.log(argument);
	this.rectificationMethod_ = parseInt(argument);
	this.updateSequence();
	return this.currentSequenceString();
}

Application.prototype.setInversion = function(argument)
{
	this.inversion_ = parseInt(argument);
	this.updateSequence();
	return this.currentSequenceString();
}

Application.prototype.setProgression = function(arguments)
{
	var chords = [];
	 arguments.forEach(function(element) {
	 	chords.push(parseInt(element))
	 });

	this.progression_ = chords;
	this.updateSequence();

	return this.currentSequenceString();
}

Application.prototype.debug = function(arguments)
{
	console.log(this);
}
module.exports = new Application();

