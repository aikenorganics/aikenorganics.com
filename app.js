'use strict'

// Vendor
const bugsnag = require('bugsnag').register(process.env.BUGSNAG_KEY)
const ozymandias = require('ozymandias')

// The App!
const app = module.exports = ozymandias()
app.locals = require('./helpers')

// Bugsnag
app.use(bugsnag.requestHandler)

// Middleware
app.use(require('./mid/market'))
app.use(require('./mid/cart'))
app.use(require('./mid/react'))

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/cart', require('./routes/cart'))
app.use('/admin', require('./routes/admin'))
app.use('/orders', require('./routes/orders'))
app.use('/growers', require('./routes/growers'))
app.use('/products', require('./routes/products'))
app.use('/settings', require('./routes/settings'))
app.use('/signup', require('./routes/signup'))
app.use('/.well-known/acme-challenge', require('./routes/acme'))

// Home
app.get('/', (req, res) => res.render('index'))

// Learn
app.get('/learn', (req, res) => res.render('learn/index'))

// 404
app.get('*', (req, res) => res.status(404).render('404'))

// 500
app.use(bugsnag.errorHandler)
app.use((e, req, res, next) => {
  console.log(e.stack)
  res.status(500).render('500')
})
