import React from 'react'

export default ({path}) => {
  return <ul className='nav nav-pills nav-stacked hidden-print'>
    <li className={/^\/admin\/growers\/?$/.test(path) ? 'active' : ''}>
      <a href='/admin/growers'>List</a>
    </li>
    <li className={/^\/admin\/growers\/orders\/?$/.test(path) ? 'active' : ''}>
      <a href='/admin/growers/orders'>Orders</a>
    </li>
  </ul>
}
