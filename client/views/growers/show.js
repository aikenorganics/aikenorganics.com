import React from 'react'
import marked from 'marked'
import Nav from './nav'
import Product from '../products/product'

export default ({busy, canEdit, cart, grower, market: {open}, path, products, currentUser}) => {
  const {description, email, id, location, mediumImage, name, url} = grower

  return <div className='row'>
    <div className='col-md-2 text-center'>
      <Nav canEdit={canEdit} grower={grower} path={path}/>
    </div>
    <div className='col-md-10'>
      <h1>{name}</h1>
      {email ? <a href={`mailto:${email}`} target='_blank'>{email}</a> : ''}
      {url
        ? <span> • <a href={url} target='_blank'>{url}</a></span>
        : ''
      }
      {location ? ` • ${location}` : ''}
      <hr style={{clear: 'both'}}/>
      <img className='img-rounded pull-right' src={mediumImage}/>
      <div dangerouslySetInnerHTML={{__html: marked(description, {sanitize: true})}}></div>
      <h2 style={{clear: 'both'}}>
        <span>Products </span>
        {canEdit
          ? <a className='btn btn-default btn-xs' href={`/growers/${id}/products/new`}>
            New Product
          </a>
          : ''
        }
      </h2>
      <hr/>
      <div className='row'>
        {products.map((product) => {
          return <div key={product.id} className='col-md-6'>
            <Product busy={busy} cart={cart} open={open} product={product} currentUser={currentUser}/>
          </div>
        })}
      </div>
    </div>
  </div>
}
