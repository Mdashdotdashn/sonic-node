require("../js/mn-midi-device.js")

NoteStreamOutput = function(device, channel)
{
  this.output_ = device.getOutput(channel);
  this.noteStream_ = new NoteStream();

  var output = this.output_;
  this.noteStream_.connect(function(noteEvent)
	  {
      if (noteEvent.gate)
      {
        output.sendNoteOn(noteEvent.note, noteEvent.velocity);
      }
      else
      {
        output.sendNoteOff(noteEvent.note);
      }
	  });
}

NoteStreamOutput.prototype.add = function(note, lengthInTick)
{
  this.noteStream_.add(note, lengthInTick);
}

NoteStreamOutput.prototype.tick = function()
{
  this.output_.sendSync();
  this.noteStream_.tick();
}

NoteStreamOutput.prototype.sendStart = function()
{
  this.output_.sendStart();
}
