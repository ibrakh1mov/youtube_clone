const path = require('path')
const express = require('express')
const cors = require("cors")
const multer = require('multer')
const app = express()
const jwt = require('jsonwebtoken')
const upload = multer({ limits: { fileSize: 200 * 1024 * 1024 } }).single(
    'img_url'
)
app.use(cors())
app.use(express.json())

const GET = (req, res) => {
	const { userId } = req.query
	const files = req.select('videos')
	if(userId) {
		res.status(200).json(
			files.filter(file => file.userId == userId)
		)
	} else {
		res.status(200).json(files)
	}
}

const POST = async (req, res) => {
    let body = await req.body
    let file_body = await req.files
	try {
        upload(req, res, async err => {
            try {
                if (err instanceof multer.MulterError) {
                    return res.json({
                    ERROR: err.message,
                })
                } else if (err) {
                    return res.json({
                    ERROR: err.message,
                })
                }
                if (!/(video)/g.test(req.files.file.mimetype)) {
                    return res.json({
                    ERROR: 'Rasm yuklang!',
                })
                }
            } catch (error) {
                return res.json({
                ERROR: error.message,
                })
            }
        })


		const  video  = await file_body.file
        let size = parseInt((video.size / 1024 / 1024) + 1)
		const title  = body.title
        console.log(title);
        console.log(req.userId);
        // const { userId, agent } = jwt.verify(req.headers.token, 'SECRET_KEY')
        let userId = req.params.user_id
        console.log(userId);
		
		const videoName = '/' + (Date.now() % 1000) + video.name.replace(/\s/g, '')
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hours = date.getHours()
        let minute = date.getMinutes()

        let str = '0'
        let str2 = '0'
        let str3 = '0'
        let str4 = '0'
        month = (month + '').length == 1 ? str += month : month
        day = (day + '').length == 1 ? str2 += day : day
        hours = (hours + '').length == 1 ? str3 += hours : hours
        minute = (minute + '').length == 1 ? str4 += minute : minute

		video.mv( path.join(process.cwd(), 'src', 'files', videoName) )

        const files = req.select('videos')
        let id = files.length > 0 ? files[files.length - 1].videoId + 1 : 1

		const newVideo = {
            size: size,
            videoId: id,
			path: videoName,
			title: title,
			userId: userId,
            time: year + '/' + month + '/' + day + ' | ' + hours + ':' + minute
		}

		files.push(newVideo)
		req.insert('videos', files)

		return res.status(201).json({ message: "OK" })

	} catch(error) {
		return res.status(400).json({ message: error.message })
	}
}

module.exports = {
	POST,
	GET,
}