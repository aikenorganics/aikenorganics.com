import React from 'react'
import CartForm from '../cart/form'

export default ({busy, cart, open, product, user}) => {
  const {active, available, cost, id, grower, name, smallImage, unit} = product

  return <div className='panel panel-default product'>
    <div className='panel-heading'>
      <h3 className='panel-title'>
        <a href={`/products/${id}`}>{name}</a>
      </h3>
    </div>
    <div className='panel-body'>
      <div className='media'>
        <div className='media-left media-middle'>
          <div className='image-wrapper'>
            <a href={`/products/${id}`}>
              <img className='img-rounded' src={smallImage} style={{maxWidth: '100px', maxHeight: '100px'}}/>
            </a>
          </div>
        </div>
        <div className='media-body'>
          {user
            ? <div className='pull-right'>
              <CartForm busy={busy} product={product} cart={cart}/>
            </div>
            : ''
          }
          <strong>
            <a href={`/growers/${grower.id}`}>{grower.name}</a>
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
