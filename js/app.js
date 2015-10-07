let React = require('react')
let ReactDOM = require('react-dom')
let $ = window.jQuery = require('jquery')
let CartForm = require('./views/cart/form')
let message = require('./message')
require('bootstrap')

// Show the flash message.
let flash = $('#message').data('flash')
if (flash) message(flash.type, flash.message)

// Handle submit confirmations.
$(document).on('click', '[data-confirm]', (e) => {
  if (!confirm($(e.target).data('confirm'))) e.preventDefault()
})

// Handle form submission.
$(document).on('submit', 'form', (e) => {
  $(e.target).find(':button,:submit').prop('disabled', true)
  message('info', 'Working…')
})

// Render cart forms.
$('[data-cart]').each((i, el) => {
  let data = $(el).data('cart')
  ReactDOM.render(<CartForm {...data}/>, el)
})
