import React from 'react'
import Link from '../../link'

export default ({oversold, products}) => {
  return <div>
    <h1>Products</h1>
    <div className='hidden-print'>
      {oversold
        ? <div className='btn-group'>
          <Link href='/admin/products' className='btn btn-default'>
            All
          </Link>
          <Link href='/admin/products?oversold=1' className='btn btn-primary'>
            Oversold
          </Link>
        </div>
        : <div className='btn-group'>
          <Link href='/admin/products' className='btn btn-primary'>
            All
          </Link>
          <Link href='/admin/products?oversold=1' className='btn btn-default'>
            Oversold
          </Link>
        </div>
      }
    </div>
    <hr/>
    <table className='table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Grower</th>
          <th>Supply</th>
          <th>Reserved</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products.map(({active, grower, id, name, oversold, reserved, supply}) => {
          return <tr key={id}>
            <td>
              <Link href={`/products/${id}`}>{name}</Link>
            </td>
            <td>
              <Link href={`/growers/${grower.id}`}>{grower.name}</Link>
            </td>
            <td>{supply}</td>
            <td>{reserved}</td>
            <td>
              <a href={`/admin/orders?product_id=${id}`} className='btn btn-primary btn-xs'>
                View Orders
              </a>
            </td>
            <td>
              {active
                ? <span className='label label-primary'>Active</span>
                : <span className='label label-default'>InActive</span>
              }
            </td>
            <td>
              {oversold
                ? <span className='label label-danger'>Oversold</span>
                : ''
              }
            </td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
}
