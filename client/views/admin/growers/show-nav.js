import React from 'react'
import Link from '../../link'

export default ({id, path}) => {
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className='nav-item'>
      <Link className={`nav-link${/^\/admin\/growers\/\d+\/?$/.test(path) ? ' active' : ''}`} href={`/admin/growers/${id}`}>Info</Link>
    </li>
    <li className='nav-item'>
      <Link className={`nav-link${/^\/admin\/growers\/\d+\/users\/?$/.test(path) ? ' active' : ''}`} href={`/admin/growers/${id}/users`}>Users</Link>
    </li>
  </ul>
}
