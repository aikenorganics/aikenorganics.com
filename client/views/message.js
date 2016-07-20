import React from 'react'

export default ({message}) => {
  let {active, text, type} = message || {}
  if (type === 'error') type = 'danger'

  return <div id='message' className={`message ${active ? 'active' : ''}`}>
    <span className={`alert alert-${type}`}>{text}</span>
  </div>
}
