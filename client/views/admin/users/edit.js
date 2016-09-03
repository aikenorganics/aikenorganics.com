import React from 'react'
import Image from './image'
import Form from './form'
import {destroyUser, navigate} from '../../../actions'

export default ({busy, user}) => {
  const {id, hasOrder} = user

  const destroy = () => {
    if (!window.confirm('Are you sure?')) return
    destroyUser(id).then(() => {
      navigate('/admin/users')
    }).catch(() => {})
  }

  return <div>
    <h1>Edit User</h1>
    <div className='row'>
      <div className='col-md-8'>
        <Form busy={busy} user={user} />
      </div>
      <div className='col-md-4'>
        <Image busy={busy} user={user} />
      </div>
    </div>
    {!hasOrder
      ? <div>
        <hr />
        <button type='submit' className='btn btn-link' onClick={destroy} disabled={busy}>
          Delete
        </button>
      </div>
      : ''
    }
  </div>
}
