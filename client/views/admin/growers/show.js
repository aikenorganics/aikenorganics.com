import React from 'react'
import Link from '../../link'
import Nav from './show-nav'
import Header from './header'

export default ({busy, grower, path, products}) => {
  return <div className='row'>
    <div className='col-md-2'>
      <Nav id={grower.id} path={path} />
    </div>
    <div className='col-md-10'>
      <Header busy={busy} grower={grower} />
      <h3>Totals from Complete Orders</h3>
      <hr />
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {products.map(({id, name, quantity, total}) => {
              return <tr key={id}>
                <td>
                  <Link href={`/products/${id}`}>{name}</Link>
                </td>
                <td>{quantity}</td>
                <td>${total}</td>
              </tr>
            })}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td />
              <td>${products.reduce((total, product) => {
                return total + +product.total
              }, 0).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
}
