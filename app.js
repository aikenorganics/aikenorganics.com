'use strict'

// Vendor
let ozymandias = require('ozymandias')
let body = require('body-parser')
let multer = require('multer')
let session = require('cookie-session')

// The App!
let app = module.exports = ozymandias()
app.locals = require('./helpers')

// Ensure requests are secure.
if (app.get('env') === 'production') app.use(require('./mid/secure'))

// Static Assets
if (app.get('env') === 'production') {
  app.use(ozymandias.static('public', {
    etag: false,
    lastModified: false,
    maxAge: '2h'
  }))
} else {
  app.use(ozymandias.static('public'))
}

// Proxy assets from S3
app.use('/assets', require('./routes/assets'))

// Middleware
app.use(session({
  signed: app.get('env') === 'production',
  name: 'aikenorganics',
  secret: process.env.SECRET,
  maxAge: 1000 * 60 * 60 * 24 * 7
}))
app.use(body.json())
app.use(body.urlencoded({extended: false}))
app.use(multer({dest: './tmp/uploads/', putSingleFilesInArray: true}))
app.use(require('./mid/market'))
app.use(require('./mid/cart'))
app.use(require('./mid/user'))
app.use(require('./mid/flash'))

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/cart', require('./routes/cart'))
app.use('/admin', require('./routes/admin'))
app.use('/orders', require('./routes/orders'))
app.use('/growers', require('./routes/growers'))
app.use('/products', require('./routes/products'))
app.use('/settings', require('./routes/settings'))

// Home
app.get('/', function (req, res) {
  res.render('index')
})

// Learn
app.get('/learn', function (req, res) {
  res.render('learn/index')
})

// 404
app.get('*', function (req, res) {
  res.status(404).render('404')
})

// 500
app.use(function (e, req, res, next) {
  console.log(e.stack)
  res.status(500).render('500')
})
