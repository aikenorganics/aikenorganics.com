'use strict'

const render = require('react-dom/server').renderToString

module.exports = (req, res, next) => {
  res.component = (page, values) => {
    Object.assign(req.state, values)
    res.render('component', {
      component: render(page(req.state, {}))
    })
  }
  next()
}
