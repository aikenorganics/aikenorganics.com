import React from 'react'
import Link from '../link'
import Form from './form'
import {cancelOrder} from '../../actions'

export default ({busy, market: {open}, locations, order, productOrders, currentUser}) => {
  if (!order) {
    return <div>
      <h2 className='text-center'>
        You havenʼt placed an order this week.
      </h2>
    </div>
  }

  const {id, location} = order

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
      ? <Form busy={busy} locations={locations} order={order} user={currentUser} />
      : ''
    }
    <hr />
    <p>
      If youʼd like to pay online, you can update your billing information
      from <Link href='/settings'>your settings</Link>.
    </p>
  </div>
}
