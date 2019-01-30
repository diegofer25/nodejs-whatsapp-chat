class chatSystem {
	constructor ({ input, button, box, userDisplay, io, user, axios }) {
		this.input = input
		this.button = button
		this.box = box
		this.userDisplay = userDisplay
		this.io = io
		this.user = {
			id: user + '-' + performance.now(),
			nickname: user
		}
		this.http = axios
	}

	init () {
		const vm = this
		vm.userDisplay.innerHTML = 'Olá ' + vm.user.nickname

		vm.input.addEventListener('keyup', (e) => {
			if (e.keyCode === 13) vm.sendMessage({
				user: vm.user,
				text: vm.input.value + '<br>'
			})
		})

		vm.button.addEventListener('click', (e) => {
			vm.sendMessage({
				user: vm.user,
				text: vm.input.value + '<br>'
			})
		})

		vm.io.on('message', (message) => {
			if (message.user.id !== vm.user.id) {
				vm.popMessage(message)
			}
		})

	}

	sendMessage (message) {
		const vm = this
		vm.loading(true)
		message.timestamp = new Date().getTime()
		vm.http.post('/sendmessage', message).then(({ error }) => {
			if (!error) return vm.popMessage(message)
			console.log(error.message)
			throw error.message
		}).catch(err => {
			console.error(err)
			alert('Ocorreu um erro na comunicação com o servidor')
		}).then(() => {
			vm.loading(false)
		})		
	}

	popMessage ({ user, text, timestamp }) {
		const vm = this
		vm.box.innerHTML += `<small>(${ new Date(timestamp).toLocaleTimeString() })</small> <b>${user.nickname}</b> disse: ${text}`
		vm.clear()
	}

	loading (flag) {
		const { input, button } = this
		input.disabled = flag
		button.disabled = flag
	}

	clear () {
		this.input.value = ''
	}
}
