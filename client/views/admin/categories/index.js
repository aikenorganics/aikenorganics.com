import React from 'react'
import {destroyCategory} from '../../../actions'

export default ({busy, categories}) => {
  return <div>
    <h1>
      Categories&nbsp;
      <a className='btn btn-default btn-xs' href='/admin/categories/new'>
        New Category
      </a>
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
              <a className='btn btn-default btn-xs' href={`/admin/categories/${id}/edit`}>
                Edit
              </a>
            </td>
            <td>{name}</td>
            <td>{position}</td>
            <td>
              <button type='button' className='btn btn-danger btn-xs' disabled={busy}
                onClick={(e) => { if (confirm('Are you sure?')) destroyCategory(id) }}>
                Delete
              </button>
            </td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
}

