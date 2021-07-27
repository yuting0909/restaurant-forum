const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const port = 3000

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
