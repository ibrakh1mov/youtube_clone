const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000
const app = express()

app.use( express.static(path.join( __dirname, 'public' )) )
app.use( express.static(path.join( __dirname, 'public', 'css' )) )

app.use( (req, res, next) => {
	res.sendHtml = function(fileName) {
		return res.sendFile( path.join( path.join(__dirname, 'views', fileName + '.html') ) )
	}
	next()
} )

app.get('/', (req, res) => {
    return res.sendHtml('index')
})

app.get('/admin', (req, res) => {
	return res.sendHtml('admin')
})

app.get('/login', (req, res) => {
	return res.sendHtml('login')
})

app.get('/register', (req, res) => {
    return res.sendHtml('register')
})

app.get('/update', (req, res) => {
    return res.sendHtml('update')
})

app.get('/upload', (req, res) => {
    return res.sendHtml('upload')
})

app.listen(PORT, () => console.log(`client server running at http://localhost:${PORT}`))