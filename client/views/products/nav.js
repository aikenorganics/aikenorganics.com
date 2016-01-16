import React from 'react'

export default ({canEdit, path, product: {id}}) => {
  if (!canEdit) return <span></span>
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className={/^\/products\/\d\/?$/.test(path) ? 'active' : ''}>
      <a href={`/products/${id}`}>
        Info
      </a>
    </li>
    <li className={/^\/products\/\d+\/edit\/?$/.test(path) ? 'active' : ''}>
      <a href={`/products/${id}/edit`}>
        Edit
      </a>
    </li>
  </ul>
}
