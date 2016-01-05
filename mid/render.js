'use strict'

const React = require('react')
const renderToString = require('react-dom/server').renderToString

module.exports = (req, res, next) => {
  const render = res.render

  res.render = (view, options, fn) => {
    if (typeof view === 'string') {
      return render.call(res, view, options, fn)
    }
    const html = renderToString(React.createElement(view, {
      state: Object.assign(req.state, options)
    }))
    return render.call(res, 'component', {html: html})
  }

  next()
}
