let user_Id = window.localStorage.getItem('userId')


setTimeout(renderUsers, 100)
setTimeout(renderVideos, 100)
if(user_Id) {
    async function avatar () {
        let Users = await request('/users', 'GET')
        let index = Users.findIndex(user => user.userId == user_Id)
        if(index != -1) {
            img_avatar.src = backendApi + '/images' + Users[index].img
        }
    }
    avatar()
}

home.onclick = () => {
    renderVideos()
}

btn.onclick = (event) => {
    event.preventDefault()
    if(input.value) {
        renderVideos(null, input.value)
        input.value = null
    }
}

async function renderUsers() {
    let response = await request('/users', 'GET')
    for(let user of response) {
        let li = document.createElement('li')
        let a = document.createElement('a')
        let img = document.createElement('img')
        let span = document.createElement('span')

        img.src = backendApi + '/images' + user.img
        img.width = 30
        img.height = 30
        span.textContent = user.userName

        li.className = 'channel'

        a.append(img, span)
        li.append(a)
        user_list.append(li)

        a.onclick = () => {
            renderVideos(user.userId)
        }
    }
}

avatar_img.onclick = () => {
    let token = window.localStorage.getItem('token')
    if(token) {
        window.location = '/admin'
    }
    else {
        window.location = '/login'
    }
}

async function renderVideos(userId, str) {
    list_video.innerHTML = null
    let asd = '/videos' + (userId ? ('?userId=' + userId) : '')
    let videos = await request(asd, 'GET' )
    let users = await request('/users', 'GET')
    if(str) {
        videos = videos.filter(video => video.title.toLowerCase().includes(str))
    }
    console.log(videos);
    for(let video of videos) {
        let li = document.createElement('li')
        let video1 = document.createElement('video')
        let div = document.createElement('div')
        let img = document.createElement('img')
        let div2 = document.createElement('div')
        let h2 = document.createElement('h2')
        let h3 = document.createElement('h3')
        let time = document.createElement('time')
        let a = document.createElement('a')
        let span = document.createElement('span')
        let download = document.createElement('img')
        
        let index = users.findIndex(user => {
            return user.userId == video.userId
        })
        let user_name = users[index].userName

        video1.src = await backendApi + '/videos/files' + video.path
        video1.controls = ' '
        h2.textContent = user_name
        h3.textContent = video.title
        time.textContent = video.time
        span.textContent = video.size + 'MB'
        img.src = backendApi + '/images' + users[index].img
        download.src = '../img/download.png'
        a.setAttribute('href', backendApi + '/download' + video.path)


        li.className = 'iframe'
        div.className = 'iframe-footer'
        div2.className = 'iframe-footer-text'
        h2.className = 'channel-info'
        h3.className = 'iframe-title'
        time.className = 'uploaded-time'
        a.className = 'download'

        a.append(span, download)
        div2.append(h2, h3, time, a)
        div.append(img, div2)
        li.append(video1, div)
        list_video.append(li)
    }
}





// renderVideos()
// renderUsers()