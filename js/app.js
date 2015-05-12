var $ = window.jQuery = require('jquery')
require('bootstrap')

setTimeout(function() {
  $('#message').removeClass('active')
}, 10000)

$(document).on('click', '[data-confirm]', function (e) {
  if (!confirm($(e.target).data('confirm'))) {
    e.preventDefault()
  }
})
