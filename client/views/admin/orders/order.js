import React from 'react'
import Link from '../../link'
import Status from './status'

export default ({order}) => {
  const {id, location, total, user} = order

  return <div>
    <h2>
      <Link href={`/admin/orders/${id}`}>Order #{id}</Link>
      <small> <Status order={order} /></small>
    </h2>
    <h3>
      <Link href={`/admin/users/${user.id}/edit`}>{user.name}</Link>
      <small> {user.email} - {location ? location.name : `Deliver to ${user.address}`}</small>
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
        {order.productOrders.map(({cost, id, product, quantity, total}) => {
          return <tr key={id}>
            <td>
              <Link href={`/products/${product.id}`}>{product.name}</Link>
              {product.oversold
                ? <span> <span className='label label-danger'>Oversold</span></span>
                : ''
              }
            </td>
            <td>${cost}</td>
            <td>{quantity}</td>
            <td>{total.toFixed(2)}</td>
          </tr>
        })}
      </tbody>
      <tfoot>
        <tr>
          <td />
          <td />
          <td />
          <td><strong>${total.toFixed(2)}</strong></td>
        </tr>
      </tfoot>
    </table>
  </div>
}
