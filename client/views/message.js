import React from 'react'

export default ({message}) => {
  const {active, text, type} = message || {}

  return <div id='message' className={`message ${active ? 'active' : ''}`}>
    <span className={`alert alert-${type === 'error' ? 'danger' : type}`}>
      {text}
    </span>
  </div>
}
