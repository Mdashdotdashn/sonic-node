'use strict';

var app = require('./application.js');
app.init({
 device: "iac"});

const server = require('./server.js');
server.init(app);

app.start();
server.start();
