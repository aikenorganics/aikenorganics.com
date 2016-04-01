import React from 'react'
import Link from '../../link'
import {destroyCategory} from '../../../actions'

export default ({busy, categories}) => {
  const destroy = (id) => {
    if (window.confirm('Are you sure?')) destroyCategory(id)
  }

  return <div>
    <h1>
      Categories&nbsp;
      <Link className='btn btn-default btn-xs' href='/admin/categories/new'>
        New Category
      </Link>
    </h1>
    <hr/>
    <table className='table'>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Position</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {categories.map(({id, name, position}) => {
          return <tr key={id}>
            <td>
              <Link className='btn btn-default btn-xs' href={`/admin/categories/${id}/edit`}>
                Edit
              </Link>
            </td>
            <td>{name}</td>
            <td>{position}</td>
            <td>
              <button type='button' className='btn btn-danger btn-xs' disabled={busy}
                onClick={(e) => destroy(id)}>
                Delete
              </button>
            </td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
}
