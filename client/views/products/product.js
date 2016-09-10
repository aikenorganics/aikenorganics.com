import React from 'react'
import Link from '../link'
import CartForm from '../cart/form'

export default ({busy, cart, grower, open, product, currentUser}) => {
  const {active, available, cost, id, name, mediumImage, unit} = product

  return <div className='card'>
    <Link href={`/products/${id}`}>
      <img className='card-img-top img-fluid' src={mediumImage} />
    </Link>
    <div className='card-block'>
      <div className='text-truncate'>
        <Link href={`/products/${id}`} className='card-title h6' title={name}>
          {name}
        </Link>
      </div>
      <hr />
      <p className='card-text text-truncate'>
        <Link className='text-muted' href={`/growers/${grower.id}`} title={grower.name}>
          {grower.name}
        </Link>
      </p>
      {open
        ? <p className='card-text text-muted text-truncate'>
          {active
            ? available
              ? <small>{available} Available</small>
              : <small className='text-danger'>Sold Out</small>
            : <small>Unavailable</small>
          }
          <br />
          <small title={`$${cost} / ${unit}`}>${cost} / {unit}</small>
        </p>
        : null
      }
      <div className='text-xs-center'>
        <CartForm busy={busy} product={product} cart={cart} open={open} />
      </div>
    </div>
  </div>
}
