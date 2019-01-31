/**
 * @Author Diego Lamarão
 */

module.exports = class NodeServer {
	constructor (dependencies, files) {
		this.dependencies = dependencies
		this.files = files
	}

	start () {
		const vm = this
		const { dependencies, files } = vm

		vm.createServer(dependencies)

		vm.setRender(dependencies)

		vm.configureExpress(dependencies)

		vm.startRoutes({ dependencies, files })

		vm.startServer(dependencies)
	}

	set (name, dependencie) {
		this.dependencies[name] = dependencie
	}

	createServer ({ http, express, io }) {
		const app = express()
		const server = http.createServer(app)
		this.set('app', app)
		this.set('server', server)
		this.set('socket', io.listen(server))
	}

	setRender ({ app, dir }) {
		app.use((req, res, next) => {
			res.render = (view) => {
				res.sendFile(view + '.html', { root: dir + '/public/' })
			}
			next()
		})
	}

	configureExpress ({ app, express, bodyParser }) {
		app.use(express.static('public'))
		app.use(bodyParser.urlencoded({
			extended: true,
			limit: '500mb'
		}))
		app.use(bodyParser.json({
			limit: '500mb'
		}))
	}

	startRoutes ({ dependencies, files }) {
		const { routes } = files
		routes(dependencies)
	}

	startServer ({ server }) {
		server.listen(8080, '0.0.0.0', () => {
			console.log('Servidor Inciado: http://localhost:8080')
		})
	}
}
