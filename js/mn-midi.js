var MessageType = {
     NOTE_OFF : 0x80,
     NOTE_ON : 0x90,
     AFTERTOUCH : 0xA0,
     CONTROL_CHANGE : 0xB0,
     PROGRAM_CHANGE : 0xC0,
     CHANNEL_AFTERTOUCH : 0xD0,
     PITCH_BEND : 0xE0,
     MIDI_CLOCK : 0xF0,
     TIMING_START : 0xFA,
     TIMING_STOP : 0xFC,
     TIMING_CONTINUE : 0xFB,
     TIMING_CLOCK : 0xF8
}

SMakeMidiMessage = function(status, data1, data2)
{
  return [ status, data1, data2 ];
}

SMakeNoteOn = function(pitch, velocity, channel)
{
  return SMakeMidiMessage(MessageType.NOTE_ON + channel, pitch, Math.floor(velocity * 127));
}

SMakeNoteOff = function(pitch, channel)
{
  return SMakeMidiMessage(MessageType.NOTE_ON + channel, pitch, 0);
}
