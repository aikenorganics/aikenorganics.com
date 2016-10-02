import React from 'react'
import Product from '../products/product'

export default ({busy, cart, currentUser, newsHtml, open, products}) => {
  return <div>
    <div dangerouslySetInnerHTML={{__html: newsHtml}} />
    <h2>Featured Items</h2>
    <div className='row'>
      {products.map((product) => {
        const {grower, id} = product
        const props = {busy, cart, currentUser, grower, open, product}
        return <div key={id} className='col-xs-6 col-md-4 col-lg-3'>
          <Product {...props} />
        </div>
      })}
    </div>
  </div>
}
