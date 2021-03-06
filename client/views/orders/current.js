import React from 'react'
import Link from '../link'
import Form from './form'
import {
  cancelOrder,
  destroyProductOrder
} from '../../actions'

export default ({busy, market: {open}, locations, order, productOrders, currentUser}) => {
  if (!order) {
    return <div>
      <h2 className='text-xs-center'>
        You havenʼt placed an order this week.
      </h2>
    </div>
  }

  const {id, location} = order

  const cancel = () => {
    if (window.confirm('Are you sure?')) cancelOrder(id)
  }

  return <div>
    <h3>
      {location
        ? `Pickup Location: ${location.name}`
        : `Deliver to ${currentUser.address}`
      }
    </h3>
    <div className='table-responsive'>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Quantity</th>
            <th>Total</th>
            <th />
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
              <td>
                {open
                  ? <button id={`remove-product-order-${id}`} className='btn btn-danger btn-sm'
                    onClick={() => { if (window.confirm('Are you sure?')) destroyProductOrder(id) }}>
                    Remove
                  </button>
                  : null
                }
              </td>
            </tr>
          })}
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td />
            <td />
            <td>
              <strong>${productOrders.reduce((sum, {total}) => sum + total, 0).toFixed(2)}</strong>
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
    {open
      ? <Form busy={busy} locations={locations} order={order} user={currentUser} />
      : ''
    }
    {open
      ? <button className='btn btn-danger float-xs-right' onClick={cancel} disabled={busy}>
        Cancel Order
      </button>
      : ''
    }
  </div>
}
