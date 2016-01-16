import React from 'react'

export default ({canEdit, grower: {id}, path}) => {
  if (!canEdit) return <span></span>
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className={/^\/growers\/\d\/?$/.test(path) ? 'active' : ''}>
      <a href={`/growers/${id}`}>
        Info
      </a>
    </li>
    <li className={/^\/growers\/\d+\/edit\/?$/.test(path) ? 'active' : ''}>
      <a href={`/growers/${id}/edit`}>
        Edit
      </a>
    </li>
    <li className={/^\/growers\/\d+\/orders\/?$/.test(path) ? 'active' : ''}>
      <a href={`/growers/${id}/orders`}>
        Orders
      </a>
    </li>
    <li className={/^\/growers\/\d+\/products\/?$/.test(path) ? 'active' : ''}>
      <a href={`/growers/${id}/products`}>
        Products
      </a>
    </li>
  </ul>
}
