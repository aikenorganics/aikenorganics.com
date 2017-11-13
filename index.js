'use strict'

module.exports = () => {
  // The App!
  const app = module.exports = require('ozymandias')()
  const {get} = require('koa-route')

  // Some settings.
  try {
    Object.assign(app.context, {
      client: require('./client/component'),
      User: require('./db/user')
    })
  } catch (error) {}

  // Sections
  Object.assign(app.sections, {
    admin: '/admin/(.*)*',
    app: '(.*)*'
  })

  app.use(require('./cart'))
  app.use(require('./layout'))
  app.use(require('./market'))

  // CSP
  app.use(async (_, next) => {
    await next()
    if (!_.response.is('html')) return
    _.csp('img-src', 'https://q.stripe.com')
    _.csp('frame-src', 'https://checkout.stripe.com')
    _.csp('script-src', 'https://checkout.stripe.com')
    _.csp('connect-src', 'https://checkout.stripe.com')
  })

  // Routes
  for (const route of [].concat(
    require('./routes/admin'),
    require('./routes/cart'),
    require('./routes/growers'),
    require('./routes/learn'),
    require('./routes/market'),
    require('./routes/orders'),
    require('./routes/product-orders'),
    require('./routes/products'),
    require('./routes/settings'),
    require('./routes/signup'),
    require('ozymandias/session')
  )) app.use(route)

  // Home
  app.use(get('/', async (_) => _.render()))

  // 404
  app.use(async (_) => _.notfound())

  return app
}
