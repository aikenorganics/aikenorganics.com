import React from 'react'
import Form from './form'

export default ({busy}) => {
  return <div>
    <h1>Edit Location</h1>
    <hr />
    <Form busy={busy} />
  </div>
}
