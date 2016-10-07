'use strict'

const assets = require('ozymandias/assets')
const {html, raw} = require('ozymandias/html')

const analytics = () => process.env.NODE_ENV !== 'production' ? '' : html`
<script>
  window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }
  ga.l = +new Date
  ga('create', 'UA-60091047-1', 'auto')
  ga('send', 'pageview')
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>
`

module.exports = ({json, state}, content) => html`
<!doctype html>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'>
  <title>Aiken Organics</title>
  <link rel='stylesheet' href='${assets.path('css/app.css')}'>
  <link rel='shortcut icon' href='${assets.path('favicon.ico')}'>
  <link rel='apple-touch-icon' href='${assets.path('apple-touch-icon.png')}'>
  <script defer src='${assets.path('js/app.js')}'></script>
  ${raw(analytics())}
</head>
<body>
  ${raw(content)}
  ${raw(json('state', state || {}))}
</body>
</html>
`
