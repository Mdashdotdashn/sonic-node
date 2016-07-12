'use strict';

var app = require('./application.js');
app.init({
 device: "through"});

const server = require('./server.js');
server.init(app);

app.start();
server.start();
