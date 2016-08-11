import React from 'react'
import Form from './form'

export default ({busy}) => {
  return <div>
    <h1>New Category</h1>
    <hr/>
    <Form busy={busy}/>
  </div>
}
