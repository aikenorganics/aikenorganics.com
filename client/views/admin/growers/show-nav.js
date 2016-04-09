import React from 'react'
import Link from '../../link'

export default ({id, path}) => {
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className={/^\/admin\/growers\/\d+\/?$/.test(path) ? 'active' : ''}>
      <Link href={`/admin/growers/${id}`}>Info</Link>
    </li>
    <li className={/^\/admin\/growers\/\d+\/users\/?$/.test(path) ? 'active' : ''}>
      <Link href={`/admin/growers/${id}/users`}>Users</Link>
    </li>
  </ul>
}
