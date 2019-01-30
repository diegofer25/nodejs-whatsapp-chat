module.exports = ({ app, socket }) => {

	app.get('/', (req, res) => {
		res.render('index', { title: 'Meu WhatsApp' })
	})

	app.post('/sendmessage', (req, res) => {
		try {
			const { body } = req
			socket.emit('message', body)
			res.sendStatus(200)
		} catch (error) {
			console.log(error)
			res.send({ error })
		}		
	})

}