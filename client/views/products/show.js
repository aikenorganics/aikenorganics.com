import React from 'react'
import Link from '../link'
import Product from './product'

export default ({busy, canEdit, cart, path, product, market: {open}, currentUser}) => {
  const {active, available, category, cost, descriptionHtml, grower, id, name, unit} = product
  return <div className='row'>
    <div className='col-md-3'>
      <Product busy={busy} cart={cart} currentUser={currentUser} grower={product.grower} open={open} product={product} />
    </div>
    <div className='col-md-9'>
      {canEdit
        ? <Link className='btn btn-sm btn-secondary pull-xs-right' href={`/products/${id}/edit`}>
          Edit
        </Link>
        : null
      }
      <h1>{name}</h1>
      {open
        ? <span> ${cost} / {unit} • {
            active && grower.active ? `${available} Available` : 'Unavailable'
          } • </span>
        : ''
      }
      <Link href={`/growers/${grower.id}`}>
        {grower.name}
      </Link> • {category.name}
      <div className='clearfix'>
        <hr />
      </div>
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
    </div>
  </div>
}
