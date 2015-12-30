import React from 'react'

export default ({active, message, type}) => {
  if (type === 'error') type = 'danger'
  return <div className={`message ${active ? 'active' : ''}`}>
    <span className={`alert alert-${type}`}>
      {message}
    </span>
  </div>
}
