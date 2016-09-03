import React from 'react'
import Link from '../../link'

export default ({path}) => {
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className='nav-item'>
      <Link className={`nav-link${/^\/admin\/growers\/?$/.test(path) ? ' active' : ''}`} href='/admin/growers'>List</Link>
    </li>
    <li className='nav-item'>
      <Link className={`nav-link${/^\/admin\/growers\/orders\/?$/.test(path) ? ' active' : ''}`} href='/admin/growers/orders'>Orders</Link>
    </li>
  </ul>
}
