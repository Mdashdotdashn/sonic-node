var midi = require("midi");

require("./mn-midi.js");

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

    var lowercaseInName = outname.toLowerCase();
    var input = new midi.input();
    var count = input.getPortCount();
    for (i=0; i < count; i++)
    {
      var inputName = input.getPortName(i);
      if (inputName.toLowerCase().indexOf(lowercaseInName) != -1)
      {
        var currentInput = new midi.input();
  /*      currentInput.openPort(i);
        device.inputs_.push(currentInput);
  */    }
    }

    if (device.inputs_.length + device.outputs_.length > 0)
    {
      return device;
    }
}

MidiDevice = {

  find : function(name)
  {
    return SFindMatching(name, name);
  }
}
