import React from 'react'
import Form from './form'
import Errors from '../../errors'

export default ({busy, errors}) => {
  return <div>
    <h1>New User</h1>
    <Errors errors={errors} />
    <Form busy={busy} />
  </div>
}
