(async function (dependencies, files) {

	const { app, dir, http, io, bodyParser } = dependencies

	const server = http.createServer(app)
	dependencies.socket = io.listen(server)

	const { routes } = files

	app.set('views', [dir + '/public'])
	app.set('view engine', 'ejs')
	app.use(require('serve-static')(dir + '/public/assets'))
	app.use(bodyParser.urlencoded({
		extended: true,
		limit: '500mb'
	}))
	app.use(bodyParser.json({
		limit: '500mb'
	}))

	routes(dependencies)

	server.listen(8080, '0.0.0.0', () => {
		console.log('Servidor Inciado: http://localhost:8080')
	})

})({ // Dependencies
	app: require('express')(),
	http: require('http'),
	io: require('socket.io'),
	bodyParser: require('body-parser'),
	dir: __dirname
}, { // Files
	routes: require('./src/routes')
})