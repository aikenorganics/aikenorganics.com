'use strict'

const qs = require('querystring')
const React = require('react')
const parseUrl = require('url').parse
const renderToString = require('react-dom/server').renderToString
const Routes = require('../client/routes').default
const toJSON = require('object-tojson')
const assets = require('ozymandias/assets')

module.exports = (req, res, next) => {
  res.react = (state) => {
    const url = parseUrl(req.originalUrl)
    const path = url.pathname
    const params = qs.parse((url.search || '').slice(1))

    state = toJSON(Object.assign({
      busy: false,
      canEdit: req.canEdit,
      cart: req.cart.cart,
      market: req.market,
      path: path,
      url: req.originalUrl,
      currentUser: req.user,
      version: assets.version
    }, params, state))

    res.format({
      json: () => res.json(state),
      html: () => res.render('component', {
        state: state,
        html: renderToString(React.createElement(Routes, state))
      })
    })
  }
  next()
}
