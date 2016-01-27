import React from 'react'
import Nav from './nav'

export default ({canEdit, grower, mediumImage, path, products}) => {
  const {name} = grower
  const total = products.reduce((sum, {cost, reserved}) => {
    return sum + +cost * reserved
  }, 0).toFixed(2)

  return <div className='row'>
    <div className='col-md-3 text-center'>
      <p>
        <img className='img-rounded' src={mediumImage}/>
      </p>
      <Nav canEdit={canEdit} grower={grower} path={path}/>
    </div>
    <div className='col-md-9'>
      <h1>{name}</h1>
      <h2>Orders</h2>
      <hr/>
      <table className='table'>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map(({cost, id, name, reserved}) => {
            return <tr key={id}>
              <td>
                <a href={`/products/${id}`}>{name}</a>
              </td>
              <td>{reserved}</td>
              <td>${(+cost * reserved).toFixed(2)}</td>
            </tr>
          })}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td>${total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
}
