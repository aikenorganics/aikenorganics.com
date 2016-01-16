import React from 'react'
import marked from 'marked'
import CartForm from '../cart/form'
import Nav from './nav'

export default ({canEdit, cart, path, products: [product], market: {open}, user}) => {
  const {active, available, category, cost, description, grower, name, mediumImage, unit} = product
  return <div className='row'>
    <div className='col-md-3 text-center'>
      {user
        ? <p>
          <CartForm product={product} cart={cart}/>
        </p>
        : ''
      }
      <p>
        <img className='img-rounded' src={mediumImage}/>
      </p>
      <Nav canEdit={canEdit} path={path} product={product}/>
    </div>
    <div className='col-md-9'>
      <h1>{name}</h1>
      {open
        ? <span> ${cost} per {unit} • {
            active && grower.active ? `${available} Available` : 'Unavailable'
          } • </span>
        : ''
      }
      <a href={`/growers/${grower.id}`}>
        {grower.name}
      </a> • {category.name}
      <div className='clearfix'>
        <hr/>
      </div>
      <div dangerouslySetInnerHTML={{__html: marked(description, {sanitize: true})}}/>
    </div>
  </div>
}
