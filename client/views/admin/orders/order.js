import React from 'react'
import Status from './status'

export default ({order}) => {
  const {id, location, total, user} = order

  return <div>
    <h2>
      <a href={`/admin/orders/${id}`}>Order #{id}</a>
      <small> <Status order={order}/></small>
    </h2>
    <h3>
      <a href={`/admin/users/${user.id}/edit`}>{user.name}</a>
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
              <a href={`/products/${product.id}`}>{product.name}</a>
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
          <td></td>
          <td></td>
          <td></td>
          <td><strong>${total.toFixed(2)}</strong></td>
        </tr>
      </tfoot>
    </table>
  </div>
}
