import React from 'react'
import Link from '../link'

export default ({canEdit, grower: {id}, path}) => {
  if (!canEdit) return null
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className='nav-item'>
      <Link className={`nav-link${/^\/growers\/\d\/?$/.test(path) ? ' active' : ''}`} href={`/growers/${id}`}>
        Info
      </Link>
    </li>
    <li className='nav-item'>
      <Link className={`nav-link${/^\/growers\/\d+\/edit\/?$/.test(path) ? ' active' : ''}`} href={`/growers/${id}/edit`}>
        Edit
      </Link>
    </li>
    <li className='nav-item'>
      <Link className={`nav-link${/^\/growers\/\d+\/orders\/?$/.test(path) ? ' active' : ''}`} href={`/growers/${id}/orders`}>
        Orders
      </Link>
    </li>
    <li className='nav-item'>
      <Link className={`nav-link${/^\/growers\/\d+\/products\/?$/.test(path) ? ' active' : ''}`} href={`/growers/${id}/products`}>
        Products
      </Link>
    </li>
  </ul>
}
