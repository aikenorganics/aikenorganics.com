import React from 'react'
import {updateLocation, removeLocation} from '../../../actions'

export default ({location}) => {
  const {active, id, name} = location

  return <tr>
    <td>
      <a className='btn btn-default btn-xs' href={`/admin/locations/${id}/edit`}>
        Edit
      </a>
    </td>
    <td>{name}</td>
    <td>
      <div className='btn-group'>
        <button type='button'
          className={`btn btn-xs ${active ? 'btn-primary' : 'btn-default'}`}
          onClick={() => updateLocation(id, {active: true})}>
          Active
        </button>
        <button type='button'
          className={`btn btn-xs ${!active ? 'btn-danger' : 'btn-default'}`}
          onClick={() => updateLocation(id, {active: false})}>
          Inactive
        </button>
      </div>
    </td>
    <td>
      <button type='button'
        className='btn btn-danger btn-xs'
        onClick={() => { if (window.confirm('Are you sure?')) removeLocation(id) }}>
        Delete
      </button>
    </td>
  </tr>
}
