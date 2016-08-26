import React from 'react'
import Link from '../link'

export default ({canEdit, path, product: {id}}) => {
  if (!canEdit) return null
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className={/^\/products\/\d+\/?$/.test(path) ? 'active' : ''}>
      <Link href={`/products/${id}`}>
        Info
      </Link>
    </li>
    <li className={/^\/products\/\d+\/edit\/?$/.test(path) ? 'active' : ''}>
      <Link href={`/products/${id}/edit`}>
        Edit
      </Link>
    </li>
  </ul>
}
