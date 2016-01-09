import React from 'react'

export default ({state: {path}, children}) => {
  return <main className='container'>
    <ul className='nav nav-tabs subnav hidden-print'>
      <li className={/^\/admin\/users/.test(path) ? 'active' : ''}>
        <a href='/admin/users'>Users</a>
      </li>
      <li className={/^\/admin\/orders/.test(path) ? 'active' : ''}>
        <a href='/admin/orders'>Orders</a>
      </li>
      <li className={/^\/admin\/categories/.test(path) ? 'active' : ''}>
        <a href='/admin/categories'>Categories</a>
      </li>
      <li className={/^\/admin\/locations/.test(path) ? 'active' : ''}>
        <a href='/admin/locations'>Locations</a>
      </li>
      <li className={/^\/admin\/products/.test(path) ? 'active' : ''}>
        <a href='/admin/products'>Products</a>
      </li>
      <li className={/^\/admin\/growers/.test(path) ? 'active' : ''}>
        <a href='/admin/growers'>Growers</a>
      </li>
      <li className={/^\/admin\/market/.test(path) ? 'active' : ''}>
        <a href='/admin/market'>Market</a>
      </li>
    </ul>
    {children}
  </main>
}
