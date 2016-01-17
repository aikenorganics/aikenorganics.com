import React from 'react'
import Image from './image'
import Form from './form'
import {destroyUser} from '../../../actions'

export default ({busy, users: [user]}) => {
  const {id, has_order} = user

  const destroy = () => {
    if (!window.confirm('Are you sure?')) return
    destroyUser(id).then(() => window.location = '/admin/users')
  }

  return <div>
    <h1>Edit User</h1>
    <div className='row'>
      <div className='col-md-8'>
        <Form user={user}/>
      </div>
      <div className='col-md-4'>
        <Image user={user}/>
      </div>
    </div>
    {!has_order
      ? <div>
        <hr/>
        <button type='submit' className='btn btn-danger' onClick={destroy} disabled={busy}>
          Delete
        </button>
      </div>
      : ''
    }
  </div>
}
