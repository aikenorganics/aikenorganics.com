'use strict'

const qs = require('qs')
const React = require('react')
const parseUrl = require('url').parse
const renderToString = require('react-dom/server').renderToString
const Routes = require('../client/routes').default

module.exports = (req, res, next) => {
  res.react = (state) => {
    const url = parseUrl(req.originalUrl)
    const path = url.pathname
    const params = qs.parse((url.search || '').slice(1))

    state = Object.assign({
      canEdit: req.canEdit,
      cart: req.cart.cart,
      market: req.market,
      path: path,
      url: req.originalUrl,
      user: req.user
    }, params, state)

    const html = renderToString(React.createElement(Routes, state))
    res.render('component', {html: html, state: state})
  }
  next()
}
