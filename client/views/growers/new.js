import React from 'react'
import Form from './form'

export default ({busy, errors}) => {
  return <div>
    <h1>New Grower</h1>
    <Form busy={busy} errors={errors}/>
  </div>
}
