var $ = window.jQuery = require('jquery')
require('bootstrap')

var messageTimeout = setTimeout(function() {
  $('#message').removeClass('active')
}, 10000)

$(document).on('click', '[data-confirm]', function (e) {
  if (!confirm($(e.target).data('confirm'))) {
    e.preventDefault()
  }
})

$(document).on('submit', 'form', function (e) {
  $(e.target).find(':button,:submit').prop('disabled', true)
  clearTimeout(messageTimeout)
  $('#message').html(
    "<span class='alert alert-info'>Working…</span>"
  ).addClass('active')
})
