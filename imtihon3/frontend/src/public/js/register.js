async function signup(event) {
    let user_id = window.localStorage.getItem('userId')
    if(!user_id) {
        
    }
    event.preventDefault()
    console.log('form');
    let file = uploadInput.files[0]
    let newUser = {
        usernName: usernameInput.value,
        password: passwordInput.value,
        file: file
    }
    const formData = new FormData()
    formData.append('userName', usernameInput.value)
    formData.append('password', passwordInput.value)
    formData.append('file', file)
    let response = await request('/register', 'POST', formData)
    console.log(response)
    
    if(response['ERROR']) {
        error.textContent = response["ERROR"]
        error.style.color = 'red'
    }

    else {
        window.localStorage.setItem('token', response.token)
		window.localStorage.setItem('userId', response.userId)
        window.location = '/'
        error.textContent = response['message']
        error.style.color = 'green'
    }

}
let user_id = window.localStorage.getItem('userId')
if(!user_id) {        
    form.onsubmit = signup
}else {
    window.location = '/'
}
