import React from 'react'

export default ({product: {cost, id, name, reserved}}) => {
  return <tr key={id}>
    <td>
      <a href={`/products/${id}`}>{name}</a>
    </td>
    <td>{reserved}</td>
    <td>${(+cost * reserved).toFixed(2)}</td>
  </tr>
}
