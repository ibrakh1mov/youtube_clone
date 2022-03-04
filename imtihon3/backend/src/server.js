const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require("cors")
const fileUpload = require('express-fileupload')

const PORT = process.env.PORT || 4004
const app = express()
const modelMiddleware = require('./middlewares/model.js')
const authTokenMiddleware = require('./middlewares/authToken.js')

const func_register = require('./controllers/auth.js').register
const func_login = require('./controllers/auth.js').login
const videoRouter = require('./routes/video.js')
const videoController = require('./controllers/video.js')

app.use(express.json())
app.use(cors())
app.use(fileUpload())
app.use(modelMiddleware)

app.get('/videos/files/:fileName', (req, res) => {
    let fileName = req.params.fileName
    res.sendFile(path.join(__dirname, 'files', fileName))
})

app.get('/images/:imageName', (req, res) => {
    let imageName = req.params.imageName
    res.sendFile(path.join(__dirname, 'images', imageName))
})

app.delete('/videos', (req, res) => {
    const id = req.query.videoId
    let result = fs.readFileSync(path.join(__dirname, 'database', 'videos.json'), 'utf-8')
    let videos = result ? JSON.parse(result) : []
    if(id) {
        let index = videos.findIndex(video => {
            return id == video.videoId
        })
        videos.slice(index, 1)
        req.insert('videos', videos)
    }
})

app.get('/videos', (req, res) => {
    const {userId} = req.query
    let result = fs.readFileSync(path.join(__dirname, 'database', 'videos.json'), 'utf-8')
    let videos = result ? JSON.parse(result) : []
    if(userId) {
        videos = videos.filter(file => file.userId == userId)
        res.json(videos)
	}
    else {
        res.json(videos)
    }
})

app.get('/download/:fileName', (req, res) => {
	res.download( path.join(__dirname, 'files', req.params.fileName) )
})

app.get('/videos/:userId', (req, res) => {
    let result = fs.readFileSync(path.join(__dirname, 'database', 'videos.json'), 'utf-8')
    let videos = result ? JSON.parse(result) : []
    videos = videos.filter(video => {
        video.userId == req.params.userId
    })
    res.json(videos)
})

app.post('/videos/:user_id', videoController.POST)
app.post('/register', func_register)
app.post('/login', func_login)
app.get('/users', (req, res) => {
    return res.json(req.select('users'))
})
// app.use(authTokenMiddleware)
// app.use('/videos', videoRouter)

app.listen(PORT, () => console.log('Server is running on http://localhost:' + PORT))