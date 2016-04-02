import React from 'react'
import Link from '../link'

export default ({path, children}) => {
  return <main className='container'>
    <ul className='nav nav-tabs subnav hidden-print'>
      <li className={/^\/admin\/users/.test(path) ? 'active' : ''}>
        <Link href='/admin/users'>Users</Link>
      </li>
      <li className={/^\/admin\/orders/.test(path) ? 'active' : ''}>
        <a href='/admin/orders'>Orders</a>
      </li>
      <li className={/^\/admin\/categories/.test(path) ? 'active' : ''}>
        <Link href='/admin/categories'>Categories</Link>
      </li>
      <li className={/^\/admin\/locations/.test(path) ? 'active' : ''}>
        <Link href='/admin/locations'>Locations</Link>
      </li>
      <li className={/^\/admin\/products/.test(path) ? 'active' : ''}>
        <a href='/admin/products'>Products</a>
      </li>
      <li className={/^\/admin\/growers/.test(path) ? 'active' : ''}>
        <Link href='/admin/growers'>Growers</Link>
      </li>
      <li className={/^\/admin\/market/.test(path) ? 'active' : ''}>
        <Link href='/admin/market'>Market</Link>
      </li>
    </ul>
    {children}
  </main>
}
