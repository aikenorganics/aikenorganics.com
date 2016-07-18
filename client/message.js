import React from 'react'
import {render} from 'react-dom'
import Message from './views/message'

// Hide message after some time.
let timer = null

export default (type, message) => {
  const el = document.getElementById('message')
  if (timer) clearTimeout(timer)

  if (type == null) {
    render(<Message/>, el)
    return
  }

  render(<Message type={type} message={message} active/>, el)

  timer = setTimeout(() => {
    render(<Message type={type} message={message}/>, el)
  }, 10000)
}
