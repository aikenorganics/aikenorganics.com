'use strict'

const assets = require('ozymandias/assets')
const {html, raw} = require('ozymandias/html')

const analytics = () => {
  if (process.env.NODE_ENV !== 'production') return ''
  return html`<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga')
    ga('create','UA-60091047-1','auto')
    ga('send','pageview')
  </script>`
}

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
  ${raw(json('state', state || {}))}
</head>
<body>
  ${raw(content)}
</body>
</html>
`
