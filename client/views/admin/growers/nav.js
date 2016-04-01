import React from 'react'
import Link from '../../link'

export default ({path}) => {
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className={/^\/admin\/growers\/?$/.test(path) ? 'active' : ''}>
      <Link href='/admin/growers'>List</Link>
    </li>
    <li className={/^\/admin\/growers\/orders\/?$/.test(path) ? 'active' : ''}>
      <Link href='/admin/growers/orders'>Orders</Link>
    </li>
  </ul>
}
