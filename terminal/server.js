'use strict';

const Hapi = require('hapi');

var Server = function()
{
    this.server_ = new Hapi.Server();
}

Server.prototype.init = function(parser)
{
    this.server_.parser_ = parser;

    this.server_.connection({ port: 3000 });
    this.server_.register(require('inert'));

    // set up static routes

    this.server_.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('terminal/index.html');
        }
    });

    this.server_.route({
        method: 'GET',
        path: '/monitor.png',
        handler: function (request, reply) {
            reply.file('terminal/monitor.png');
        }
    });

    this.server_.route({
        method: 'GET',
        path: '/terminal/{file*}',
        handler: {
            directory: {
                path: 'terminal/terminal'
            }
        }
    });

    // route command url to the parser

    this.server_.route({
        method: 'GET',
        path: '/command',
        handler: function (request, reply) {
            var input = request.url.query.command;
            var response;
            try {
                var result = request.server.parser_.parse(input);
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
}

Server.prototype.start = function()
{
    this.server_.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server running at:', this.server_.info.uri);
    });    
}

module.exports = new Server();
