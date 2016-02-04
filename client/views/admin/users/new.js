import React from 'react'
import Form from './form'

export default ({busy}) => {
  return <div>
    <h1>New User</h1>
    <Form busy={busy}/>
  </div>
}
