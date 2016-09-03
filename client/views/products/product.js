import React from 'react'
import Link from '../link'
import CartForm from '../cart/form'

export default ({busy, cart, open, product, currentUser}) => {
  const {active, available, cost, id, name, mediumImage, unit} = product

  return <div className='card'>
    <Link href={`/products/${id}`}>
      <img className='card-img-top img-fluid' src={mediumImage} />
    </Link>
    <div className='card-block'>
      <h5 className='card-title text-truncate' title={name}>
        <Link href={`/products/${id}`}>
          {name}
        </Link>
      </h5>
      {open
        ? <p className='card-text text-muted text-truncate'>
          {active
            ? (available ? `${available} Available` : 'Sold Out')
            : <span>Unavailable</span>
          }
          <br />
          <span title={`$${cost} per ${unit}`}>${cost} per {unit}</span>
        </p>
        : null
      }
      <div className='text-xs-center'>
        <CartForm busy={busy} product={product} cart={cart} open={open} />
      </div>
    </div>
  </div>
}
