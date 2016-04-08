import React from 'react'
import Link from '../../link'
import {updateLocation, destroyLocation} from '../../../actions/index'

export default ({busy, location}) => {
  const {active, id, name} = location

  return <tr>
    <td>
      <Link href={`/admin/locations/${id}/edit`} className='btn btn-default btn-xs'>
        Edit
      </Link>
    </td>
    <td>{name}</td>
    <td>
      <div className='btn-group'>
        <button type='button' disabled={busy}
          className={`btn btn-xs ${active ? 'btn-primary' : 'btn-default'}`}
          onClick={() => updateLocation(id, {active: true}).catch((e) => {})}>
          Active
        </button>
        <button type='button' disabled={busy}
          className={`btn btn-xs ${!active ? 'btn-danger' : 'btn-default'}`}
          onClick={() => updateLocation(id, {active: false}).catch((e) => {})}>
          Inactive
        </button>
      </div>
    </td>
    <td>
      <button type='button' disabled={busy}
        className='btn btn-danger btn-xs'
        onClick={() => { if (window.confirm('Are you sure?')) destroyLocation(id).catch((e) => {}) }}>
        Delete
      </button>
    </td>
  </tr>
}
