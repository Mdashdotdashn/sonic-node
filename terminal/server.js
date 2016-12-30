'use strict';

const Hapi = require('hapi');

// -----------------------------------------------------------------------------

var Reporter = function()
{
  this.info_ = "";
}

Reporter.prototype.init = function(publisher)
{
  var wtf = this;
  publisher.on('info', function(info)
  {
    wtf.info_ = info;
  })
}

Reporter.prototype.collectInfo = function(reply)
{
  if (this.info_ != "")
  {
    reply( { reply: this.info_});
    this.info_ = "";
  }
  else {
    var wtf = this;
    setTimeout(function() { wtf.collectInfo(reply);} , 50);
  }
}


// -----------------------------------------------------------------------------

var Server = function()
{
    this.server_ = new Hapi.Server();
    this.server_.reporter_ = new Reporter();
}

Server.prototype.init = function(application)
{
    this.server_.application_ = application;
    this.server_.reporter_.init(application.publisher_);
    this.server_.connection({ port: 3000 });
    this.server_.register(require('inert'));

    // set up static routes

    this.server_.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('terminal/index-edit.html');
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
                var result = request.server.application_.parse(input);
                response = { reply: result};
            }
            catch(err)
            {
                console.log(err);
                console.log(err.stack);
                response = { reply: "*error*: " + err.message };
            }
            reply(response);
            }
    });

    // route response url to application feedbacl

    this.server_.route({
        method: 'GET',
        path: '/reporter',
        handler: function (request, reply) {
            request.server.reporter_.collectInfo(reply);
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
