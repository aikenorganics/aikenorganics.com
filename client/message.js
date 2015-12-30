import React from 'react'
import {render} from 'react-dom'
import Message from './views/message'

const el = document.getElementById('message')

// Hide message after some time.
let timer = null

module.exports = (type, message) => {
  if (timer) clearTimeout(timer)
  render(<Message type={type} message={message} active/>, el)
  timer = setTimeout(() => {
    render(<Message type={type} message={message}/>, el)
  }, 10000)
}
