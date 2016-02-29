import React from 'react'
import Form from './form'
import {cancelOrder} from '../../actions'
import Billing from '../users/billing'

export default ({busy, market: {open}, locations, order, currentUser}) => {
  if (!order) {
    return <div>
      <p className='text-center'>
        You havenʼt placed an order yet.
      </p>
    </div>
  }

  const {id, location, productOrders} = order

  const cancel = () => {
    if (window.confirm('Are you sure?')) cancelOrder(id)
  }

  return <div>
    {open
      ? <button className='btn btn-danger pull-right' onClick={cancel} disabled={busy}>
        Cancel Order
      </button>
      : ''
    }
    <h1>Current Order</h1>
    <h3>Pickup Location: {location.name}</h3>
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
              <a href={`/products/${product.id}`}>{product.name}</a>
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
          <td>
            <strong>${order.total.toFixed(2)}</strong>
          </td>
        </tr>
      </tfoot>
    </table>
    {open
      ? <Form busy={busy} locations={locations} order={order}/>
      : ''
    }
    {currentUser.is_admin
      ? <div>
        <hr/>
        <h2>Billing Information</h2>
        <Billing busy={busy} user={currentUser}/>
      </div>
      : ''
    }
  </div>
}
