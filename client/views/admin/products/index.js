import React from 'react'
import Link from '../../link'
import Pagination from '../../pagination'
import Search from '../../search'

export default ({more, oversold, page, products, search, url}) => {
  return <div>
    <h1>Products</h1>
    <div className='hidden-print'>
      {oversold
        ? <div className='btn-group'>
          <Link href='/admin/products' className='btn btn-default'>
            All
          </Link>
          <Link href='/admin/products?oversold=1' className='btn btn-success'>
            Oversold
          </Link>
        </div>
        : <div className='btn-group'>
          <Link href='/admin/products' className='btn btn-success'>
            All
          </Link>
          <Link href='/admin/products?oversold=1' className='btn btn-default'>
            Oversold
          </Link>
        </div>
      } <div style={{display: 'inline-block'}}>
        <Search url='/admin/products' value={search} />
      </div>
    </div>
    <hr />
    <table className='table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Grower</th>
          <th>Supply</th>
          <th>Reserved</th>
          <th />
          <th />
          <th />
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
              <Link href={`/admin/orders?productId=${id}`} className='btn btn-success btn-xs'>
                View Orders
              </Link>
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
    <hr />
    <Pagination more={more} page={page} url={url} />
  </div>
}
