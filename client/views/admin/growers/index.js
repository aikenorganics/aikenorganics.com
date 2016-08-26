import React from 'react'
import Link from '../../link'
import Nav from './nav'

export default ({growers, path}) => {
  const total = growers.reduce((sum, {total}) => sum + +total, 0)

  return <div className='row'>
    <div className='col-md-2'>
      <Nav path={path} />
    </div>
    <div className='col-md-10'>
      <h1>Growers</h1>
      <hr />
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Active</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {growers.map(({active, id, name, total}) => {
            return <tr key={id}>
              <td>
                <Link href={`/admin/growers/${id}`}>{name}</Link>
              </td>
              <td>
                {active
                  ? <span className='label label-primary'>Active</span>
                  : <span className='label label-default'>Inactive</span>
                }
              </td>
              <td>${total || 0}</td>
            </tr>
          })}
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td />
            <td>${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
}
