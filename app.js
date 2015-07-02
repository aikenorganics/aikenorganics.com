// Vendor
var ozymandias = require('ozymandias')
var compression = require('compression')
var body = require('body-parser')
var multer = require('multer')
var session = require('cookie-session')

// The App!
var app = module.exports = ozymandias()
app.locals = require('./helpers')

// Middleware
if (app.get('env') === 'production') app.use(require('./mid/secure'))
app.use(session({
  signed: app.get('env') === 'production',
  name: 'aikenorganics',
  secret: process.env.SECRET,
  maxAge: 1000 * 60 * 60 * 24 * 7
}))
app.use(body.urlencoded({extended: false}))
app.use(multer({dest: './tmp/uploads/', putSingleFilesInArray: true}))
app.use(compression())
app.use(ozymandias.static('public'))
app.use(require('./mid/market'))
app.use(require('./mid/cart'))
app.use(require('./mid/user'))
app.use(require('./mid/flash'))
app.use(require('./mid/transaction'))

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/cart', require('./routes/cart'))
app.use('/admin', require('./routes/admin'))
app.use('/posts', require('./routes/posts'))
app.use('/assets', require('./routes/assets'))
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
