'use strict'

// The App!
const app = module.exports = require('ozymandias')()
const {get} = require('koa-route')

// Some settings.
Object.assign(app.context, {
  client: require('./client/component'),
  User: require('./db/user')
})

app.use(require('./csp'))
app.use(require('./cart'))
app.use(require('./layout'))
app.use(require('./market'))

// Routes
for (const route of [].concat(
  require('./routes/admin'),
  require('./routes/cart'),
  require('./routes/growers'),
  require('./routes/market'),
  require('./routes/orders'),
  require('./routes/products'),
  require('./routes/settings'),
  require('./routes/signin'),
  require('./routes/signup'),
  require('ozymandias/session')
)) app.use(route)

// Home
app.use(get('/', function *() { this.react() }))

// Learn
app.use(get('/learn', function *() { this.react() }))

// 404
app.use(function *() {
  this.notfound()
})
