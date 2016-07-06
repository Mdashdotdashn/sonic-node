'use strict';

require("../js/mn-sequence.js");
require("../js/mn-midi-device.js");
require("../js/mn-heartbeat.js");
require("../js/mn-scale.js");
require("../js/mn-chord.js");
require("../js/mn-chordprogression.js");
require("../js/mn-note.js");
require("../js/mn-utils.js");

var scale = "minor";
var rootNote = "d3";

var makeChordProgression = function(rootNote, scale, progression)
{
    var cp = new ChordProgression(rootNote, scale);
    var chordSequence = [];
    progression.forEach(function(degree) {
      chordSequence.push(cp.chord(degree));
      });

    return chordSequence;   
}

var makeChordSequence = function(chordNames)
{
    var chordSequence = [];
    chordNames.forEach(function(chordName)
    {
        chordSequence.push(new Chord(notesfromchordname(chordName)));
    });

    return chordSequence;
}

const Hapi = require('hapi');
var peg = require("pegjs");
var fs = require('fs');
var app = require('./serverapp.js');

app.init({
 device: "iac"});

var parser;

fs.readFile( __dirname + '/grammar.txt', function (err, data) {
  if (err) {
    throw err; 
  }
  parser = peg.buildParser(data.toString());

});


const server = new Hapi.Server();
server.connection({ port: 3000 });
server.register(require('inert'));
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.file('terminal/index.html');
    }
});

server.route({
    method: 'GET',
    path: '/monitor.png',
    handler: function (request, reply) {
        reply.file('terminal/monitor.png');
    }
});

server.route({
    method: 'GET',
    path: '/command',
    handler: function (request, reply) {
        var input = request.url.query.command;
        var response;
        try {
            var result = parser.parse(input.toLowerCase()); // returns ["a", "b", "b", "a"]
            var chords = JSON.parse("[" + result + "]");
            var chordSequence = makeChordProgression(rootNote, scale, chords);
            chordSequence[0].invert(0);
           console.log(chordSequence);
 
            app.setChordSequence(chordSequence);
            response = { reply: result};
        }
        catch(err) 
        {
            console.log(err)
            response = { reply: "*error*: " + err.message };
        }
        reply(response);
    }
});

server.route({
    method: 'GET',
    path: '/terminal/{file*}',
    handler: {
        directory: {
            path: 'terminal/terminal'
        }
    }
});

server.route({
    method: 'POST',
    path: '/{name}',
    handler: function (request, reply) {
        console.log(request.params.name);
        reply({ name: request.params.name});
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

app.run();
