var $ = window.jQuery = require('jquery')
require('./bootstrap')

setTimeout(function() {
  $('#message').removeClass('active')
}, 10000)
