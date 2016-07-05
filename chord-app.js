var extend = require("extend")
makeChordSequence = function(rootNote, scale, progression)
{
	var cp = new ChordProgression(rootNote, scale);
	var chordSequence = [];
	progression.forEach(function(degree) {
	  chordSequence.push(cp.chord(degree));
	  });

	return chordSequence;	
}

//------------------------------------------------------------

ChordApp = function(options)
{
	var parameters =
	{
		sequence: [],
		rectify: 0,
		device: "",
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
		this.output_ = device.getOutput(0);

	}

	this.resolution_ = parameters.resolution;

	this.gateLength_ = parameters.length * 6 * parameters.resolution;
	console.log(this);
}

ChordApp.prototype.run = function()
{
	var noteStream = new NoteStream();

	var sequence = new StepSequence(this.resolution_);
	sequence.setContent(this.sequence_);

	var heartbeat = new Heartbeat();
	var output = this.output_;
	var gateLength = this.gateLength_;

	heartbeat.connect(sequence);
	heartbeat.connect(function()
	  {
	    output.sendSync();
	    noteStream.tick();
	  });

	sequence.connect(function(step)
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

	this.output_.sendStart();
}

