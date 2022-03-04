form.onsubmit = async (event) => {
    event.preventDefault()
    let user_id = window.localStorage.getItem('userId')
    let file = await uploadInput.files[0]
    const formData = new FormData()
    formData.append('title', videoInput.value)
    formData.append('file', file)
    let response = await request('/videos/' + user_id, 'POST', formData)

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

async function Video_render() {
    let data = await request('/videos', 'GET')
    let USERid = window.localStorage.getItem('userId')
    data = data.filter(video => video.userId == USERid)
    console.log(data);
    for(let video of data) {
        let li = document.createElement('li')
        let video2 = document.createElement('video')
        let p = document.createElement('p')
        let img = document.createElement('img')

        li.className = 'video-item'
        p.className = 'content'

        video2.src = backendApi + '/videos/files' + video.path
        video2.controls = ' '
        p.textContent = video.title
        img.src = './img/delete.png'
        img.width = 25
        console.log(video.videoId);

        img.onclick =  async () => {
            let qwer = '/videos?videoId=' + video.videoId
            admin_list.remove(li)
            await request(qwer, 'DELETE')
        }

        li.append(video2, p, img)
        admin_list.append(li)

    }
}

Video_render()