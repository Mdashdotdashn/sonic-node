'use strict';

if ( global.v8debug) {
	global.v8debug.Debug.setBreakOnException(); // enable it, global.v8debug is only defined when the --debug or --debug-brk flag is set
}

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
