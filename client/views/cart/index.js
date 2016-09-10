import React from 'react'
import Link from '../link'
import Warning from './warning'
import Checkout from './checkout'
import {updateCart} from '../../actions'

export default ({busy, cart, currentUser, locations, order, products}) => {
  const quantity = ({active, available, grower, id}) => {
    if (!active || !grower.active) return 0
    return Math.min(+cart[id] || 0, available)
  }

  const total = (product) => quantity(product) * +product.cost

  const available = products.filter((product) => quantity(product) > 0)

  const remove = (id) => updateCart(id, 0).catch(() => {})

  const meatWarning = products.some((product) => product.category.meat)

  return <div>
    <h1>Shopping Cart</h1>
    <Warning cart={cart} products={products} />
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
          {available.map((product) => {
            const {cost, id, name, unit} = product
            return <tr key={id}>
              <td>
                <Link href={`/products/${id}`}>{name}</Link>
              </td>
              <td>${(+cost).toFixed(2)} / {unit}</td>
              <td>{quantity(product)}</td>
              <td>${total(product).toFixed(2)}</td>
              <td>
                <button className='btn btn-danger btn-sm' onClick={() => remove(id)}>
                  Remove
                </button>
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
              <strong>
                ${available.reduce((sum, product) => {
                  return sum + total(product)
                }, 0).toFixed(2)}
              </strong>
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
    {meatWarning
      ? <p className='form-text'>
        The price of some items in your cart are based on weight and their
        price may change slightly.
      </p>
      : ''
    }
    {available.length > 0
      ? <Checkout busy={busy} order={order} locations={locations} user={currentUser} />
      : ''
    }
  </div>
}
