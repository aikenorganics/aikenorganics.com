import React from 'react'
import {createLocation, navigate, updateLocation} from '../../../actions'

export default ({busy, location}) => {
  let name = null

  const save = (event) => {
    event.preventDefault()
    const values = {name: name.value}
    const request = location
      ? updateLocation(location.id, values)
      : createLocation(values)
    request.then(() => navigate('/admin/locations')).catch(() => {})
  }

  return <form onSubmit={save}>
    <div className='form-group'>
      <label htmlFor='name'>Name</label>
      <input autoFocus type='text' id='name' className='form-control' required
        defaultValue={location ? location.name : ''}
        ref={(input) => { name = input }}
        disabled={busy} />
    </div>
    <p className='text-xs-right'>
      <button type='submit' className='btn btn-success' disabled={busy}>
        Save
      </button>
    </p>
  </form>
}
