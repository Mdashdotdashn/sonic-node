'use strict';

var app = require('./application.js');
app.init({
// device: "through" // Linux
// device: "microsoft" // Windows
// device: "loop" // Windows 2
 device: "iac" // Mac
});

const server = require('./server.js');
server.init(app);

app.start();
server.start();
