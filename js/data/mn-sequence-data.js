sequenceDataStore = [
  {
    name: "killer-scene",
    type: "bass",
    signature: "4/4",
    data: {
      length : "3.1.1",
      sequence:
        [
          { position: "1.1.1", degrees: [1]},
          { position: "1.2.3", degrees: [3]},
          { position: "1.3.1", degrees: [3]},
          { position: "1.4.3", degrees: [1]},
          { position: "2.1.3", degrees: [1]},
          { position: "2.2.3", degrees: [3]},
          { position: "2.3.1", degrees: [3]},
        ]
      }
  },
  {
    name: "says-1",
    type: "arp",
    signature: "4/4",
    data: {
      length : "2.1.1",
      sequence:
        [
          { position: "1.1.1", degrees: [{d:1, t:-12}]},
          { position: "1.1.3.3", degrees: [1]},
          { position: "1.2.2.3", degrees: [2]},
          { position: "1.3.1", degrees: [1]},
          { position: "1.3.4.2", degrees: [3]},
          { position: "1.4.4.2", degrees: [3]},
        ]
      }
  },
  {
    name: "arp-10",
    type: "arp",
    signature: "4/4",
    data: {
      length : "2.1.1",
      sequence:
        [
          { position: "1.1.1", degrees: [{d:1, t:12}, 1]},
          { position: "1.1.3", degrees: [2]},
          { position: "1.2.1", degrees: [3]},
          { position: "1.2.3", degrees: [{d:1, t:12}, 1]},
          { position: "1.3.1", degrees: [3]},
          { position: "1.3.3", degrees: [2]},
          { position: "1.4.1", degrees: [{d:1, t:12}, 1]},
          { position: "1.4.3", degrees: [2]},
        ]
      }
  },
  {
    name: "chords",
    type: "chords",
    signature: "4/4",
    data: {
      length : "2.1.1",
      sequence:
        [
          { position: "1.1.1", degrees: [{d:1, t:-12}, 1, 2 ,3]},
        ]
      }    
  },
]
