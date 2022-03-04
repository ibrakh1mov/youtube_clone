const express = require('express')
const sha256 = require('sha256')
const cors = require("cors")
const jwt = require('jsonwebtoken')
const path = require("path")
const multer = require('multer')
const app = express()
const upload = multer({ limits: { fileSize: 200 * 1024 * 1024 } }).single(
    'img_url'
)
app.use(cors())
app.use(express.json())


async function register (req, res)  {
	let body = req.body
    try {
        //hanler error
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

				if(!req.files) {
					return res.json({
					ERROR: 'Rasm yuklang!',
					})
				}

                if (!/(image)/g.test(req.files.file.mimetype)) {
                    return res.json({
                    ERROR: 'Rasm yuklang!',
                })
                }
            } catch (error) {
                return res.json({
                ERROR: error.message,
                })
            }

			if(body.password.length < 5) return res.json({ERROR: 'the length of the password must be at least 5'})
			if(body.password.length > 15) return res.json({ERROR: 'the length of the password should not exceed 15'})
			if(!(/[A-Za-z]/).test(body.password)) return res.json({ERROR: 'the password must contain a letter'})
			if(!(/[0-9]/).test(body.password)) return res.json({ERROR: 'the password must contain a number'})
			if(!(/[!@#$%^&*]/).test(body.password)) return res.json({ERROR: 'the password must contain a character(!@#$%^&*)'})
			if(body.userName.length > 50) return res.json({ERROR: 'the length of the userName should not exceed 50'})

			let users = req.select('users')
			let index = users.findIndex(user => user.userName == body.userName)
			if(index == -1) {
				let id
				if(users.length > 0) {
					id = users[users.length - 1].userId + 1
				}
				else {
					id = 1
				}
				let image = await req.files.file
				console.log(req.files);
				const imageName = (Date.now() % 1000) + image.name.replace(/\s/g, '')
				image.mv( path.join(process.cwd(), 'src', 'images', imageName) )
				let newUser = {
					userId : id,
					userName: body.userName,
					password: sha256(body.password),
					img: '/' + imageName
				}
				users.push(newUser)
				req.insert('users', users)
				return res.json({ 
					userId: newUser.userId,
					message: 'The user successfully registered!',
					token: jwt.sign({ userId: newUser.userId, agent: req['headers']['user-agent'] }, 'SECRET_KEY')
				})
			}
			else {
				return res.json({
					ERROR: 'username is available in the database'
				})
			}			
        })
    } catch (error) {
        return res.json({ ERROR: error.message })
    }
}





async function login (req, res)  {
	let body = req.body
    try {
		let users = req.select('users')
		let index = users.findIndex(user => user.userName == body.userName && user.password == sha256(body.password))
		
		if(index != -1) {
			return res.json({ message: 'The user successfully logged in!'})
		}
		else {
			return res.json({
				ERROR: 'wrong password or username'
			})
		}

		
    } catch (error) {
        return res.json({ ERROR: error.message })
    }
}

module.exports = {
	register,
	login
}