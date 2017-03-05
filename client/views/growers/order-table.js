import React from 'react'
import Row from './order-row'

export default ({products}) => {
  const total = products.reduce((sum, {cost, reserved}) => {
    return sum + (+cost * reserved)
  }, 0)

  return <div>
    <div className='table-responsive'>
      <table className='table'>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {products.filter((product) => product.reserved).map((product) => {
            return <Row key={product.id} product={product} />
          })}
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td />
            <td>${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
}
