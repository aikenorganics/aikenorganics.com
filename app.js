'use strict'

// Vendor
const bugsnag = require('bugsnag').register(process.env.BUGSNAG_KEY)
const ozymandias = require('ozymandias')

// The App!
const app = module.exports = ozymandias()

// Some settings.
app.set('component', require('./client/component'))
app.set('layout', require('./views/layout'))
app.set('layout.json', require('./json/layout'))

// Locals
Object.assign(app.locals, {
  moment: require('moment'),
  assets: require('ozymandias/assets')
})

// Bugsnag
app.use(bugsnag.requestHandler)

// Middleware
app.use(require('./mid/market'))
app.use(require('./mid/cart'))

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/cart', require('./routes/cart'))
app.use('/admin', require('./routes/admin'))
app.use('/orders', require('./routes/orders'))
app.use('/growers', require('./routes/growers'))
app.use('/products', require('./routes/products'))
app.use('/settings', require('./routes/settings'))
app.use('/signin', require('./routes/signin'))
app.use('/signup', require('./routes/signup'))

// Home
app.get('/', (req, res) => res.react())

// Learn
app.get('/learn', (req, res) => res.react())

// 404
app.get('*', (req, res) => res.notfound())

// 500
app.use(bugsnag.errorHandler)
app.use((error, req, res, next) => res.error(error))
