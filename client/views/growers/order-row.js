import React from 'react'
import Link from '../link'

export default ({product: {cost, id, name, reserved}}) => {
  return <tr key={id}>
    <td>
      <Link href={`/products/${id}`}>{name}</Link>
    </td>
    <td>{reserved}</td>
    <td>${(+cost * reserved).toFixed(2)}</td>
  </tr>
}
