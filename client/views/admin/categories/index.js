import React from 'react'
import Link from '../../link'
import {destroyCategory} from '../../../actions'

export default ({busy, categories}) => {
  const destroy = (id) => {
    destroyCategory(id).catch(() => {})
  }

  return <div>
    <h1>
      Categories <Link href='/admin/categories/new' className='btn btn-secondary btn-sm'>New Category</Link>
    </h1>
    <hr />
    <div className='table-responsive'>
      <table className='table'>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Position</th>
            <th>Meat</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {categories.map(({id, meat, name, position, removable}) => {
            return <tr key={id}>
              <td>
                <Link href={`/admin/categories/${id}/edit`} className='btn btn-link btn-sm'>
                  Edit
                </Link>
              </td>
              <td>{name}</td>
              <td>{position}</td>
              <td>{meat ? '✓' : ''}</td>
              <td>
                {removable
                  ? <button type='button' className='btn btn-link btn-sm' disabled={busy} onClick={() => destroy(id)}>
                    Delete
                  </button>
                  : null
                }
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  </div>
}
