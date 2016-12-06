require("../js/mn-midi-device.js");
require("../js/theory/theory.js");
require("../js/sequencing/sequencing.js");
require("../js/progression/progression.js");
require("../js/mn-scale.js");
require("../js/mn-note.js");
require("../js/mn-utils.js");

require("./notestream-output.js")

var extend = require("extend")
var peg = require("pegjs");
var fs = require('fs');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

// -----------------------------------------------------------------------------

var Publisher = function()
{
}

util.inherits(Publisher, EventEmitter);

Publisher.prototype.report = function(info)
{
	this.emit('info', info);
}

// -----------------------------------------------------------------------------

var Application = function()
{
	console.log("loading grammar..");
	fs.readFile( __dirname + '/grammar.txt', function (err, data) {
	  if (err) {
	    throw err;
	  }
	  this.parser = peg.generate(data.toString());
		console.log("loaded.");
	});

	this.publisher_ = new Publisher();
}

// Init merely sets up the data and parameters

Application.prototype.init = function(options) {

	var parameters =
	{
		device: "",
		tempo: 120,
		resolution: 16,  // In sixteenth
		length: 0.5,      // percentage
		ticksPerBeat: 24,
	}

	extend(parameters, options);

	this.progression_ = [];
	this.scale_ = "major";
	this.rootNote_ = "c3";
	this.inversion_ = -2;
	this.rectificationMethod_ = 1;

	if (parameters.device.trim())
	{
		var device = MidiDevice.find(parameters.device);
		if (device)
		{
			this.chordOutput_ = new NoteStreamOutput(device, 0);
			this.bassOutput_ = new NoteStreamOutput(device, 1);
		}
	}

	this.resolutionInSixteenth_ = parameters.resolution;
	this.gateLength_ = parameters.length  * parameters.resolution  * parameters.ticksPerBeat / 4;
	this.tempo_ = parameters.tempo;
	this.signature_ = new Signature();
	this.ticksPerBeat_ = parameters.ticksPerBeat;
};

Application.prototype.start = function()
{
	this.chordSequencer_ = new StepSequence(this.resolutionInSixteenth_);
	this.bassSequencer_ = new StepSequence(this.resolutionInSixteenth_);

  // Sets up the heartbeat
	var heartbeat = new Heartbeat(this.ticksPerBeat_);
	heartbeat.setTempo(this.tempo_);

	// Sets up the beat time source
	this.beatTimeSource_ = new BeatTimeSource(this.ticksPerBeat_);
	heartbeat.connect(this.beatTimeSource_);

	// Hook up sequencers
	var chordOutput = this.chordOutput_;
	var gateLength = this.gateLength_;
	var bassOutput = this.bassOutput_;
	var bassSequencer = this.bassSequencer_;
	var publisher = this.publisher_;
	var signature = this.signature_;

	// trigger the chord sequencer
	this.beatTimeSource_.connect(this.chordSequencer_);
	// trigger the bqss sequencer
	this.beatTimeSource_.connect(this.bassSequencer_);
	// Debug timeline
/*	this.beatTimeSource_.connect(function(position){
		if (position.ticks_ == 0)
		{
			var beatCount = position.beats_;
			var beatPerMeasure =  signature.numerator;
			console.log(Math.floor(beatCount / beatPerMeasure + 1) + "." + (beatCount % beatPerMeasure + 1) + "." + (position.sixteenth_ + 1));
		}
	})*/
	// flushes midi output
	heartbeat.connect(function()
	  {
	    chordOutput.tick();
   	  bassOutput.tick();
	  });

  // Implement step trigger for the chords
	this.chordSequencer_.connect(function(step)
	  {
				var notes = "";
	      step.notes_.forEach(function(midinote) {
						 notes += ":" + notename(midinote);
	           chordOutput.add(midinote,gateLength);
	        });
				bassSequencer.setContent([step.bass_, step.bass_ - 12]);
				publisher.report("chord "+ notes);
	  });

	// Implement step trigger for the bass
	this.bassSequencer_.connect(function(step)
		{
			bassOutput.add(step, 8);
		});

	// Start ticking
	heartbeat.run();

	// Send midi sync
	this.chordOutput_.sendStart();
}

Application.prototype.updateSequence = function()
{
	if (this.progression_.length != 0)
	{
		// create chord progression
		var chordSequence = makeChordProgression(this.rootNote_, this.scale_, this.progression_);
		// apply desired inversion to the first chord
		chordSequence[0].notes_ = invertChord(chordSequence[0].notes_,this.inversion_);
		// apply voicing
		rectify_progression(chordSequence, this.rectificationMethod_);
		this.chordSequencer_.setContent(chordSequence);
	}
	else
	{
		this.chordSequencer_.setContent([]);
		this.bassSequencer_.setContent([]);
	}
}

Application.prototype.currentSequenceString = function()
{
	var chordnameList = "Chord sequence: ";
	var chordSequence = this.chordSequencer_.getContent();
	chordSequence.forEach(function (chord)
	{
		chordnameList += chordname(chord.notes_) + ",";
	})
	return chordnameList;
}

Application.prototype.parse = function(command)
{
	var result = parser.parse(command); // returns something like a function call: method, arg1, arg2, arg3
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
	this.chordSequencer_.setResolution(argument);
	return this.currentSequenceString();
}

Application.prototype.analyseNotes = function(argument)
{
	var result = scalesFromNotes(argument);
	return "score: " + result.score_ + "\n" + result.scaleList_;
	return this.currentSequenceString();
}

Application.prototype.analyseChords = function(argument)
{
	var result = scalesFromChords(argument);
	return "score: " + result.score_ + "\n" + result.scaleList_;
	return this.currentSequenceString();
}

Application.prototype.setRectification = function(argument)
{
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
	 	chords.push(element)
	 });

	this.progression_ = chords;
	this.updateSequence();

	return this.currentSequenceString();
}

Application.prototype.setSignature = function(arguments)
{
	this.signature_.numerator = arguments.numerator;
	this.signature_.denominator =  arguments.denominator;
	return "";
}

Application.prototype.debug = function(arguments)
{
	console.log(this);
}
module.exports = new Application();
