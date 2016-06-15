import React from 'react'
import {updateCart} from '../../actions/index'

export default ({busy, cart, open, product: {active, available, id}}) => {
  const quantity = cart[id] || 0
  const canIncrement = quantity < available
  const save = (quantity) => updateCart(id, quantity).catch((e) => {})
  const decrement = () => save(quantity - 1)
  const increment = () => save(quantity + 1)

  if (!open) {
    return <button className='btn btn-default' disabled>Market Closed</button>
  }

  if (!available) {
    return <button className='btn btn-default' disabled>Sold Out</button>
  }

  if (!active) {
    return <button className='btn btn-default' disabled>Unavailable</button>
  }

  return <span className='form-inline'>
    {quantity > 0
      ? <span className='form-group'>
        <span className='input-group'>
          <span className='input-group-btn'>
            <button type='button' className='btn btn-success' disabled={busy} onClick={decrement}>
              -
            </button>
          </span>
          <span className='form-control'>{quantity}</span>
          <span className='input-group-btn'>
            <button type='button' className='btn btn-success' disabled={busy || !canIncrement} onClick={increment}>
              +
            </button>
          </span>
        </span>
      </span>
      : <button type='button' className='btn btn-success' disabled={busy} onClick={increment}>
        Add to Cart
      </button>
    }
  </span>
}
