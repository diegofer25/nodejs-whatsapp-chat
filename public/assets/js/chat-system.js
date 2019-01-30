/**
 * @Author Diego Lamarão
 */
class chatSystem {
	constructor ({ input, button, box, start, userDisplay, io, user, axios }) {
		this.input = input
		this.start = start
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
		if (!vm.user.nickname || vm.user.nickname === 'Você') location.reload()
		else vm.start.style.display = 'block'
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
		if (message.text.length > 4) {
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
	}

	popMessage ({ user, text, timestamp }) {
		const vm = this
		const isAuthor = user.nickname === vm.user.nickname
		vm.box.innerHTML += `
			<small>(${ vm.formatTime(timestamp) })</small>
			<b>${isAuthor ? 'Você' : user.nickname}</b>
			disse: ${text}
		`
		vm.clear()
	}

	loading (flag) {
		const { input, button } = this
		input.disabled = flag
		button.disabled = flag
	}

	formatTime (time) {
		return new Date(time).toLocaleTimeString()
	}

	clear () {
		this.input.value = ''
	}
}
