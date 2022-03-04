;(async () => {
	let token = window.localStorage.getItem('token')
	if(token) {
		try {
			await request('/users')
			if(!(window.location.pathname == '/admin')) {
				window.location = '/admin'
			}
		} catch(error) {
			window.localStorage.removeItem('token')
			window.localStorage.removeItem('userId')
			window.location = '/login'
		}
	} else {
		if((window.location.pathname == '/admin')) {
			window.location = '/login'
		}
	}
})()