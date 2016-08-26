import React from 'react'
import Link from '../link'
import Pagination from '../pagination'

export default ({currentUser, more, orders, page, url}) => {
  return <div>
    {orders.map(({id, location, productOrders, total}) => {
      return <div key={id}>
        <h2>Order #{id}</h2>
        <h3>
          {location
            ? `Pickup Location: ${location.name}`
            : `Deliver to ${currentUser.address}`
          }
        </h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {productOrders.map(({cost, id, product, quantity, total}) => {
              return <tr key={id}>
                <td>
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </td>
                <td>${cost}</td>
                <td>{quantity}</td>
                <td>${total.toFixed(2)}</td>
              </tr>
            })}
          </tbody>
          <tfoot>
            <tr>
              <td />
              <td />
              <td />
              <td>
                <strong>${total.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    })}
    <hr />
    <Pagination more={more} page={page} url={url} />
  </div>
}
