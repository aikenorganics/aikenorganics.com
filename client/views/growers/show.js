import React from 'react'
import Link from '../link'
import Nav from './nav'
import Product from '../products/product'

export default ({busy, canEdit, cart, grower, market: {open}, path, products, currentUser}) => {
  const {descriptionHtml, email, id, location, mediumImage, name, url} = grower

  return <div className='row'>
    <div className='col-md-2 text-xs-center'>
      <Nav canEdit={canEdit} grower={grower} path={path} />
    </div>
    <div className='col-md-10'>
      <h1>{name}</h1>
      {email ? <a href={`mailto:${email}`} target='_blank'>{email}</a> : ''}
      {url
        ? <span> • <a href={url} target='_blank'>{url}</a></span>
        : ''
      }
      {location ? ` • ${location}` : ''}
      <hr style={{clear: 'both'}} />
      <img className='img-rounded img-fluid pull-xs-right' src={mediumImage} />
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      <h2 style={{clear: 'both'}}>
        <span>Products </span>
        {canEdit
          ? <Link href={`/growers/${id}/products/new`} className='btn btn-secondary btn-sm'>
            New Product
          </Link>
          : ''
        }
      </h2>
      <hr />
      <div className='row'>
        {products.map((product) => {
          const props = {busy, cart, currentUser, grower, open, product}
          return <div key={product.id} className='col-xs-6 col-md-6 col-lg-4'>
            <Product {...props} />
          </div>
        })}
      </div>
    </div>
  </div>
}
