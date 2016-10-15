import React from 'react'
import Link from '../../link'
import {updateLocation, destroyLocation} from '../../../actions'

export default ({busy, location}) => {
  const {active, id, name, removable} = location

  return <tr>
    <td>
      <Link href={`/admin/locations/${id}/edit`} className='btn btn-link btn-sm'>
        Edit
      </Link>
    </td>
    <td>{name}</td>
    <td>
      <div className='btn-group'>
        <button type='button' disabled={busy}
          className={`btn btn-sm ${active ? 'btn-success' : 'btn-secondary'}`}
          onClick={() => updateLocation(id, {active: true}).catch(() => {})}>
          Active
        </button>
        <button type='button' disabled={busy}
          className={`btn btn-sm ${!active ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => updateLocation(id, {active: false}).catch(() => {})}>
          Inactive
        </button>
      </div>
    </td>
    <td>
      {removable
        ? <button type='button' disabled={busy}
          className='btn btn-link btn-sm'
          onClick={() => { if (window.confirm('Are you sure?')) destroyLocation(id).catch(() => {}) }}>
          Delete
        </button>
        : null
      }
    </td>
  </tr>
}
