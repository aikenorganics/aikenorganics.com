import React from 'react'
import App from '../app'
import Row from './product-row'

export default ({state}) => {
  const {grower, products} = state

  return <App state={state}>
      <div className='row'>
      <div className='col-md-2 text-center'>
        <ul className='nav nav-pills nav-stacked hidden-print'>
          <li>
            <a href={`/growers/${grower.id}`}>
              Info
            </a>
          </li>
          <li>
            <a href={`/growers/${grower.id}/edit`}>
              Edit
            </a>
          </li>
          <li>
            <a href={`/growers/${grower.id}/orders`}>
              Orders
            </a>
          </li>
          <li className='active'>
            <a href={`/growers/${grower.id}/products`}>
              Products
            </a>
          </li>
        </ul>
      </div>
      <div className='col-md-10'>
        <h1>{grower.name}</h1>
        <h2>Products</h2>
        <hr/>
        <table className='table'>
          <thead>
            <tr>
              <th>Product</th>
              <th>Supply</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <Row product={product} key={product.id}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </App>
}
