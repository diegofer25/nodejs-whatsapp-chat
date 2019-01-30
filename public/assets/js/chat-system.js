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
		vm.http.post('/sendmessage', message).then(({ error }) => {
			if (!error) return vm.popMessage(message)
			console.log(response)
		}).catch(err => {
			console.log(err)
			alert('Ocorreu um erro na comunicação com o servidor')
		}).then(() => {
			vm.loading(false)
		})		
	}

	popMessage (message) {
		const vm = this
		vm.box.innerHTML += `${message.user.nickname} disse: ${message.text}`
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

new chatSystem({
	input: document.getElementById('text-input'),
	button: document.getElementById('send'),
	box: document.getElementById('box-chat'),
	userDisplay: document.getElementById('user'),
	io: io('http://localhost:8080', {transports: ['websocket', 'polling', 'flashsocket']}),
	user: prompt('Bem vindo ao WathsApp Chat, por favor informe um nickname: '),
	axios
}).init()
