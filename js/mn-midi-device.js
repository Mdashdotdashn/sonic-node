var midi = require("midi");

require("./mn-midi.js");

var SFindMatching = function(inname, outname)
{
    var device =
    {
      inputs : [],
      outputs : [],

      play : function(note)
      {
        this.outputs[0].sendMessage(SMakeNoteOn(note, 127, 0));
        this.outputs[0].sendMessage(SMakeNoteOff(note, 0));
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
        var currentOutput = new midi.output();
        currentOutput.openPort(i);
        device.outputs.push(currentOutput);
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
        currentInput.openPort(i);
        device.inputs.push(currentInput);
      }
    }

  return device;
}

MidiDevice = {

  find : function(name)
  {
    return SFindMatching(name, name);
  }
}
