const backendApi = 'http://192.168.3.3:4004'

async function request (route, method, body) {
	if(method == 'DELETE') {
		let headers = {
			// token: window.localStorage.getItem('token')
		}
		await fetch(backendApi + route, {
			method,
			headers,
		})
	}
	else {

		let headers = {
			// token: window.localStorage.getItem('token')
		}
	
		if(!(body instanceof FormData)) {
			headers['Content-Type'] = 'application/json'
		}
	
		let response = await fetch(backendApi + route, {
			method,
			headers,
			body: (body instanceof FormData) ? body : JSON.stringify(body)
		})
	
		if(!(response.status === 200 || response.status === 201)) {
			response = await response.json()
			throw new Error(response.message)
		}
		return await response.json()
	}

}