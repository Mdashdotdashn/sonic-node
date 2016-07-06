var midi = require("midi");
var EventEmitter = require('events').EventEmitter;
var util = require('util');

require("./mn-midi.js");

//--------------------------------------------------------------------------------------------------

var SFindMatching = function(inname, outname)
{
    var device =
    {
      inputs_ : [],
      outputs_ : [],

      getOutput: function (channel)
      {
        var output =
        {
          sendNoteOn : function(note, velocity)
          {
            this.port_.sendMessage(SMakeNoteOn(note, velocity, this.channel_));
          },

          sendNoteOff : function(note, velocity)
          {
            this.port_.sendMessage(SMakeNoteOff(note, 0));
          },

          sendSync : function()
          {
            this.port_.sendMessage([0xF8]);
          },

          sendStart : function()
          {
            this.port_.sendMessage([0xFA]);
          }

        };

        output.channel_ = channel;
        output.port_ = this.outputs_[0];
   
        return output;
      }
    }

    var lowercaseOutName = inname.toLowerCase();
    var output = new midi.output();
    var count = output.getPortCount();
    for (i=0; i < count; i++)
    {
      var outputName = output.getPortName(i);
      if (outputName.toLowerCase().indexOf(lowercaseOutName) != -1)
      {
        console.log("opening " + outputName);
        var currentOutput = new midi.output();
        currentOutput.openPort(i);
        device.outputs_.push(currentOutput);
      }
    }

/*    var lowercaseInName = outname.toLowerCase();
    var input = new midi.input();
    var count = input.getPortCount();
    for (i=0; i < count; i++)
    {
      var inputName = input.getPortName(i);
      if (inputName.toLowerCase().indexOf(lowercaseInName) != -1)
      {
        var currentInput = new midi.input();
        currentInput.openPort(i);
        device.inputs_.push(currentInput);
      }
    }
*/
    if (device.inputs_.length + device.outputs_.length > 0)
    {
      return device;
    }
}

//--------------------------------------------------------------------------------------------------

MidiDevice = {

  find : function(name)
  {
    return SFindMatching(name, name);
  }
}

//--------------------------------------------------------------------------------------------------

NoteStream = function()
{
  EventEmitter.call(this);
  this.notes_ = {};
}

util.inherits(NoteStream, EventEmitter);

NoteStream.prototype.broadcast = function(note, isOn)
{
  this.emit("note", {note: note, velocity:1.0, gate:isOn});
}

NoteStream.prototype.add = function(note, lengthInTick)
{
  if (this.notes_[note] === undefined)
  {
    this.notes_[note] = lengthInTick;
    this.broadcast(note, true);
  }
  else
  {
    this.broadcast(note, false);
    this.broadcast(note, true);
    var length = Math.max(this.notes_[note], lengthInTick);
    this.notes_[note] = length;
  }
}

NoteStream.prototype.tick = function()
{
  for (var note in this.notes_)
  {
    if (this.notes_[note] == 0)
    {
      this.broadcast(note, false);
      delete this.notes_[note];
    }
    else
    {
      this.notes_[note] -= 1;
    }
  }
}

NoteStream.prototype.connect = function(target)
{
  if (target instanceof Function)
  {
    this.on("note", target);
  }
  else
  {
    this.on("note", function()
      {
        target.tick();
      });
  }
}
