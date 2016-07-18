import React from 'react'
import Link from '../link'
import CartForm from '../cart/form'

export default ({busy, cart, grower, open, product, currentUser}) => {
  const {active, available, cost, id, name, smallImage, unit} = product

  return <div className='panel panel-default product'>
    <div className='panel-heading'>
      <h3 className='panel-title'>
        <Link href={`/products/${id}`}>{name}</Link>
      </h3>
    </div>
    <div className='panel-body'>
      <div className='media'>
        <div className='media-left media-middle'>
          <div className='image-wrapper'>
            <Link href={`/products/${id}`}>
              <img className='img-rounded' src={smallImage} style={{maxWidth: '100px', maxHeight: '100px', border: 'solid 3px orange'}}/>
            </Link>
          </div>
        </div>
        <div className='media-body'>
          {currentUser
            ? <div className='pull-right'>
              <CartForm busy={busy} product={product} cart={cart} open={open}/>
            </div>
            : ''
          }
          <strong>
            <Link href={`/growers/${grower.id}`}>{grower.name}</Link>
            <br/>
            {open
              ? <span>
                {active ? `${available} Available` : <span>Unavailable</span>}
                <br/>
                ${cost} per {unit}
              </span>
              : ''
            }
          </strong>
        </div>
      </div>
    </div>
  </div>
}
