require("../js/theory/theory.js");
require("../js/progression/progression.js");
require("../js/mn-scale.js");
require("../js/mn-note.js");
require("../js/mn-utils.js");

require("./playback-engine.js")
require("./harmony-engine.js")

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

	this.engine_ = new PlaybackEngine();
	this.engine_.init(parameters.device)

	this.harmony_ = new HarmonyEngine();
};

Application.prototype.start = function()
{
	var publisher = this.publisher_;
	this.engine_.run();
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
		console.log("should send chord seaquence")
		this.chordSequencer_.setContent(chordSequence);
	}
}

Application.prototype.currentSequenceString = function()
{
/*	var chordnameList = "Chord sequence: ";
	var chordSequence = this.chordSequencer_.getContent();
	chordSequence.forEach(function (chord)
	{
		chordnameList += chordname(chord.notes_) + ",";
	})
	return chordnameList;*/
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

Application.prototype.rebuild = function()
{
	this.harmony_.rebuild();
}

Application.prototype.setScale = function(arguments)
{
	var scale = arguments.scale;
	var rootNote = arguments.root+"3";
	this.harmony_.setScale(scale, rootNote);

	this.rebuild();

	var scaleChords = makeChordProgression(rootNote, scale, [1,2,3,4,5,6,7]);
	scaleChordsNameList = "";
	scaleChords.forEach(function (chord)
	{
		scaleChordsNameList += chordname(chord.notes_) + ",";
	})

	return "Scale chords: " + scaleChordsNameList;
}

Application.prototype.setRectification = function(argument)
{
	this.harmony_.setRectification(parseInt(argument));
	this.rebuild();
	return "";
}

Application.prototype.setInversion = function(argument)
{
	this.harmony.setInversion(parseInt(argument));
	this.rebuild();
	return "";
}

Application.prototype.setProgression = function(arguments)
{
	var chords = [];
	 arguments.forEach(function(element) {
	 	chords.push(element)
	 });

	this.harmony_.setProgression(chords);
	this.rebuild();

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
