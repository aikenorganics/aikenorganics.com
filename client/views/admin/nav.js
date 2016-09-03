import React from 'react'
import Link from '../link'

export default ({path, children}) => {
  return <main className='container'>
    <ul className='nav nav-tabs hidden-print'>
      <li className='nav-item'>
        <Link className={`nav-link${/^\/admin\/users/.test(path) ? ' active' : ''}`} href='/admin/users'>Users</Link>
      </li>
      <li className='nav-item'>
        <Link className={`nav-link${/^\/admin\/orders/.test(path) ? ' active' : ''}`} href='/admin/orders'>Orders</Link>
      </li>
      <li className='nav-item'>
        <Link className={`nav-link${/^\/admin\/categories/.test(path) ? ' active' : ''}`} href='/admin/categories'>Categories</Link>
      </li>
      <li className='nav-item'>
        <Link className={`nav-link${/^\/admin\/locations/.test(path) ? ' active' : ''}`} href='/admin/locations'>Locations</Link>
      </li>
      <li className='nav-item'>
        <Link className={`nav-link${/^\/admin\/products/.test(path) ? ' active' : ''}`} href='/admin/products'>Products</Link>
      </li>
      <li className='nav-item'>
        <Link className={`nav-link${/^\/admin\/growers/.test(path) ? ' active' : ''}`} href='/admin/growers'>Growers</Link>
      </li>
      <li className='nav-item'>
        <Link className={`nav-link${/^\/admin\/market/.test(path) ? ' active' : ''}`} href='/admin/market'>Market</Link>
      </li>
    </ul>
    {children}
  </main>
}
