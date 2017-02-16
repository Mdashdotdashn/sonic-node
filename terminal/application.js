require("../js/theory/theory.js");
require("../js/progression/progression.js");
require("../js/mn-scale.js");
require("../js/mn-note.js");
require("../js/mn-utils.js");
require("../js/transform/transform.js")

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
		try {
			this.parser = peg.generate(data.toString());
		}
		catch(err)
		{
			console.log(err.message);
			console.log(err.location);
			throw err;
		}
		console.log("loaded.");
	});

	this.publisher_ = new Publisher();
	this.currentSequence_ = null;
}

// Init merely sets up the data and parameters

Application.prototype.init = function(options) {

	var parameters =
	{
		device: "",
		tempo: 120,
		resolution: 16,  // In sixteenth
		length: 0.5,      // percentage
	}

	extend(parameters, options);

	this.engine_ = new PlaybackEngine();
	this.engine_.init(parameters.device)

	this.harmony_ = new HarmonyEngine();

	this.sequenceLoader_ = new SequenceLoader();
	this.transformationLoader_ = new TransformationLoader();
	this.selectedPlayerIndex_ = 0;

// init default sequence
	var baseSequence = this.sequenceLoader_.load("chords");
	var player = this.engine_.getPlayer(this.selectedPlayerIndex_);
	CHECK_TYPE(player, SequencePlayer);
	player.setSequence(baseSequence);
};

Application.prototype.start = function()
{
	var publisher = this.publisher_;
	this.engine_.run();
}

Application.prototype.currentSequenceString = function()
{
	var progressionString = stringForProgression(this.chordSequence_);
	return  "Chord sequence: " + progressionString;
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
	var chordSequence = this.harmony_.rebuild();
	this.engine_.setChordSequence(chordSequence);
	this.chordSequence_ = chordSequence;
}

Application.prototype.setScale = function(arguments)
{
	var scale = arguments.scale;
	var rootNote = arguments.root;
	this.harmony_.setScale(scale, rootNote);

	this.rebuild();

	var scaleProgression = makeChordProgression(rootNote+"4", scale, [1,2,3,4,5,6,7]);
	var progressionString = stringForProgression(scaleProgression);

	return "Scale chords: " + progressionString;
}

Application.prototype.setRectification = function(argument)
{
	this.harmony_.setRectification(parseInt(argument));
	this.rebuild();
	return "";
}

Application.prototype.setInversion = function(argument)
{
	this.harmony_.setInversion(parseInt(argument));
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
	var signature = new Signature();
	signature.numerator = arguments.numerator;
	signature.denominator =  arguments.denominator;
	this.engine_.setSignature(signature);
	this.rebuild();
	return "";
}

Application.prototype.setTempo = function(arguments)
{
	this.engine_.setTempo(arguments.tempo);
}

Application.prototype.selectPlayer = function(arguments)
{
	this.selectedPlayerIndex_ = arguments.value - 1;
}

Application.prototype.transpose = function(arguments)
{
	var player = this.engine_.getPlayer(this.selectedPlayerIndex_);
	player.transpose(parseInt(arguments.value));
}

Application.prototype.generateSequence = function(arguments)
{
//	lo(arguments);
	// uses a 4th/beat as default timebase
	var ticksPerBeat = this.engine_.ticksPerBeat_;
	var baseTime = createSequencingPosition(ticksPerBeat, ticksPerBeat);
	var baseSequence = createSequenceFromDefinition(arguments.sequence, baseTime, this.engine_.signature_);

//	lo(baseSequence);

	if (baseSequence)
	{
		var player = this.engine_.getPlayer(this.selectedPlayerIndex_);
		CHECK_TYPE(player, SequencePlayer);
		player.setSequence(baseSequence);
		return "done."
	}
}

Application.prototype.loadSequence = function(arguments)
{
	var baseSequence = this.sequenceLoader_.load(arguments.name);
	if (baseSequence)
	{
		var player = this.engine_.getPlayer(this.selectedPlayerIndex_);
		CHECK_TYPE(player, SequencePlayer);
		player.setSequence(baseSequence);
		return "done."
	}
	return "sequence '"+arguments.name+"' not found.";
}

Application.prototype.resetTransformation = function()
{
	var player = this.engine_.getPlayer(this.selectedPlayerIndex_);
	CHECK_TYPE(player, SequencePlayer);
	player.resetTransformation();
}

Application.prototype.pushTransformation = function(argument)
{
	var transformation = this.transformationLoader_.load(argument.name);
	if (transformation)
	{
		transformation.setParameters(argument.parameters);
		var player = this.engine_.getPlayer(this.selectedPlayerIndex_);
		CHECK_TYPE(player, SequencePlayer);
		player.pushTransformation(transformation);
		return "done."
	}
	return "transformation '"+argument.name+"' not found.";
}


Application.prototype.listSequences = function(arguments)
{
	return this.sequenceLoader_.listSequences();
}

module.exports = new Application();
