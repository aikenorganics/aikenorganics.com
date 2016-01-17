import './pages'
import message from './message'
import marked from 'marked'

// Sanitize markdown by default.
marked.setOptions({sanitize: true})

// Bootstrap relies on window.jQuery
const $ = window.jQuery = require('jquery')
require('bootstrap')

// Show the flash message.
let flash = $('#message').data('flash')
if (flash) message(flash.type, flash.message)

// Handle submit confirmations.
$(document).on('click', '[data-confirm]', (e) => {
  if (!window.confirm($(e.target).data('confirm'))) e.preventDefault()
})

// Handle form submission.
$(document).on('submit', 'form', (e) => {
  if ($(e.target).closest('#root').length) return
  $(e.target).find(':button,:submit').prop('disabled', true)
  message('info', 'Working…')
})
