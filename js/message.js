let $ = require('jquery')
let React = require('react')
let Message = require('./views/message')
let $message = $('#message')

// Hide message after some time.
let timer = null

// Render with props!
let render = (props) => {
  React.render(<Message {...props}/>, $message[0])
}

module.exports = (type, message) => {
  if (timer) clearTimeout(timer)
  let props = {type: type, message: message, active: true}
  render(props)
  timer = setTimeout(() => {
    props.active = false
    render(props)
  }, 10000)
}
