const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const dotenv = require("dotenv")

const auth = require('./config/auth')(passport)
const home = require('./routes/home')
const register = require('./routes/register')
const login = require('./routes/login')
const account = require('./routes/account')
const admin = require('./routes/admin')

dotenv.config()

//const connectionString = `mongodb://localhost/sample-store`
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pqx5z.mongodb.net/inventory?retryWrites=true&w=majority`

mongoose.connect(connectionString, (err, data) => {
	if (err){
		console.log('DB Connection Failed')
		return
	}

	console.log('DB Connection Success')
})

const app = express()
app.use(session({
	secret: 'awehfuilawef',
	resave: true,
	saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hjs')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', home)
app.use('/register', register)
app.use('/login', login)
app.use('/account', account)
app.use('/admin', admin)

app.use((err, req, res, next) => {
	console.log('ERROR: ' + err)
	res.render('error', {message: err.message})
})

app.listen(process.env.PORT || 4000);
console.log('App running on http://localhost:4000')


