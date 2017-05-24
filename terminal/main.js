'use strict';

if ( global.v8debug) {
	global.v8debug.Debug.setBreakOnException(); // enable it, global.v8debug is only defined when the --debug or --debug-brk flag is set
}

var app = require('./application.js');

var devices =
{
	dar: "iac",
//	win: "microsoft",
	win: "loop",
	lin: "through"
}

var platformKey = process.platform.substring(0, 3);


app.init({
 device: devices[platformKey]
});

const server = require('./server.js');
server.init(app);

app.start();
server.start();
