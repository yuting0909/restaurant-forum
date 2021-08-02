const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const db = require('./models')
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')

app.use('/upload', express.static(__dirname + '/upload'))

app.engine('hbs', handlebars({ 
  defaultLayout: 'main', 
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())


app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  // db.sequelize.sync()
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
