import React from 'react'
import {updateCart} from '../../actions'

export default ({busy, cart, open, product: {active, available, id}}) => {
  const quantity = cart[id] || 0
  const canIncrement = quantity < available
  const save = (quantity) => updateCart(id, quantity).catch(() => {})
  const decrement = () => save(quantity - 1)
  const increment = () => save(quantity + 1)

  if (!open) {
    return <button className='btn btn-sm btn-secondary' disabled>Market Closed</button>
  }

  if (!available) {
    return <button className='btn btn-sm btn-secondary' disabled>Sold Out</button>
  }

  if (!active) {
    return <button className='btn btn-sm btn-secondary' disabled>Unavailable</button>
  }

  return <span className='form-inline'>
    {quantity > 0
      ? <span className='form-group'>
        <span className='input-group'>
          <span className='input-group-btn'>
            <button type='button' className='btn btn-sm btn-primary' disabled={busy} onClick={decrement}>
              -
            </button>
          </span>
          <span className='form-control form-control-sm'>{quantity}</span>
          <span className='input-group-btn'>
            <button type='button' className='btn btn-sm btn-primary' disabled={busy || !canIncrement} onClick={increment}>
              +
            </button>
          </span>
        </span>
      </span>
      : <button type='button' className='btn btn-sm btn-primary' disabled={busy} onClick={increment}>
        Add to Cart
      </button>
    }
  </span>
}
