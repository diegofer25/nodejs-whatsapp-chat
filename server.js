/**
 * @Author Diego Lamarão
 */

// Start Function
(async function (dependencies, files) {
	// Destructuring Modules Dependencies
	const { app, dir, http, io, bodyParser } = dependencies

	// Creating Server
	const server = http.createServer(app)
	dependencies.socket = io.listen(server)

	// Destructuring Files Dependencies
	const { routes } = files

	// Set Express Render (EJS)
	app.set('views', [dir + '/public'])
	app.set('view engine', 'ejs')
	// Set Static Directory
	app.use(require('serve-static')(dir + '/public/assets'))
	// Set Body Request to JSON
	app.use(bodyParser.urlencoded({
		extended: true,
		limit: '500mb'
	}))
	app.use(bodyParser.json({
		limit: '500mb'
	}))

	// Injecting Dependencies to Router
	routes(dependencies)

	// Listening Server
	server.listen(8080, '0.0.0.0', () => {
		console.log('Servidor Inciado: http://localhost:8080')
	})

})({ // Modules Dependencies
	app: require('express')(),
	http: require('http'),
	io: require('socket.io'),
	bodyParser: require('body-parser'),
	dir: __dirname
}, { // Files Dependencies
	routes: require('./src/routes')
})