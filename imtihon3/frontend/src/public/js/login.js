async function signup(event) {
    event.preventDefault()
    console.log('form');

    const formData = new FormData()
    formData.append('userName', usernameInput.value)
    formData.append('password', passwordInput.value)
    let response = await request('/login', 'POST', formData)

    if(response['ERROR']) {
        error.textContent = response["ERROR"]
        error.style.color = 'red'
    }

    else {
        window.location = '/'
        error.textContent = response['message']
        error.style.color = 'green'
    }

}

let user_ID = window.localStorage.getItem('userId')
if(!user_ID) {        
    form.onsubmit = signup
}else {
    window.location = '/'
}