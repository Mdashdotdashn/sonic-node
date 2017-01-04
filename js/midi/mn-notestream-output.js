NoteData = function(pitch, velocity, length)
{
  this.pitch = pitch;
  this.velocity = velocity;
  this.length = length;
}

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

NoteStreamOutput.prototype.add = function(data)
{
  this.noteStream_.add(data.pitch, data.velocity, data.length);
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
