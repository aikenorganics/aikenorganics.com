import './pages'
import React from 'react'
import {render} from 'react-dom'
import message from './message'
import CartForm from './views/cart/form'

// Bootstrap relies on window.jQuery
const $ = window.jQuery = require('jquery')
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
  render(<CartForm {...data}/>, el)
})
