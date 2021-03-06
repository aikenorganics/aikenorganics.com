import React from 'react'
import Nav from './nav'
import Row from './product-row'
import Errors from '../errors'

export default ({busy, canEdit, errors, grower, path, products}) => {
  return <div className='row'>
    <div className='col-md-2 text-xs-center'>
      <Nav grower={grower} path={path} canEdit={canEdit} />
    </div>
    <div className='col-md-10'>
      <h1>{grower.name}</h1>
      <h2>Products</h2>
      <hr />
      <Errors errors={errors} />
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>Product</th>
              <th>Supply</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <Row busy={busy} product={product} key={product.id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
}
