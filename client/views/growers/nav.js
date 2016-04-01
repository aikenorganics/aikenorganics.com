import React from 'react'
import Link from '../link'

export default ({canEdit, grower: {id}, path}) => {
  if (!canEdit) return <span></span>
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className={/^\/growers\/\d\/?$/.test(path) ? 'active' : ''}>
      <Link href={`/growers/${id}`}>
        Info
      </Link>
    </li>
    <li className={/^\/growers\/\d+\/edit\/?$/.test(path) ? 'active' : ''}>
      <Link href={`/growers/${id}/edit`}>
        Edit
      </Link>
    </li>
    <li className={/^\/growers\/\d+\/orders\/?$/.test(path) ? 'active' : ''}>
      <Link href={`/growers/${id}/orders`}>
        Orders
      </Link>
    </li>
    <li className={/^\/growers\/\d+\/products\/?$/.test(path) ? 'active' : ''}>
      <Link href={`/growers/${id}/products`}>
        Products
      </Link>
    </li>
  </ul>
}
