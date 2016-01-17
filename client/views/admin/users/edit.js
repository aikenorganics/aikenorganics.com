import React from 'react'
import Image from './image'
import Form from './form'

export default ({users: [user]}) => {
  const {id, has_order} = user

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
    {has_order
      ? <div>
        <hr/>
        <form method='post' action={`/admin/users/${id}/delete`} className='pull-right'>
          <button type='submit' className='btn btn-danger'
            onClick={(e) => { if (!window.confirm('Are you sure?')) e.preventDefault() }}>
            Delete
          </button>
        </form>
      </div>
      : ''
    }
  </div>
}
