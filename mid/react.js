'use strict'

const React = require('react')
const renderToString = require('react-dom/server').renderToString
const Routes = require('../client/routes').default

module.exports = (req, res, next) => {
  res.react = (state) => {
    const html = renderToString(React.createElement(Routes, {
      state: Object.assign(req.state, state)
    }))
    return res.render('component', {html: html})
  }
  next()
}
