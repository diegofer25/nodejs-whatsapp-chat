/**
 * @Author Diego Lamarão
 */

const NodeServer = require('./NodeServer')

new NodeServer({ // Modules Dependencies
	express: require('express'),
	http: require('http'),
	io: require('socket.io'),
	bodyParser: require('body-parser'),
	dir: __dirname
}, { // Files Dependencies
	routes: require('./src/routes')
}).start()
