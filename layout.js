'use strict'

const assets = require('ozymandias/assets')
const {html, raw} = require('ozymandias/html')

module.exports = async (_, next) => {
  await next()

  // Only HTML responses.
  if (!_.response.is('html') || typeof _.body !== 'string') return

  _.body = html`
<!doctype html>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'>
  <title>Aiken Organics</title>
  <link rel='shortcut icon' href='${assets.path('favicon.ico')}'>
  <link rel='apple-touch-icon' href='${assets.path('apple-touch-icon.png')}'>
  ${raw(_.styles('css/app.css'))}
  ${raw(_.json('state', _.state.client || {}))}
  ${raw(_.script('js/app.js'))}
  <script defer src='https://www.google-analytics.com/analytics.js'></script>
</head>
<body>
  ${raw(_.body)}
</body>
</html>`
}
