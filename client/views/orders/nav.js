import React from 'react'
import Link from '../link'

export default ({children, path}) => {
  return <div className='row'>
    <div className='col-md-2'>
      <h2>Orders</h2>
      <hr />
      <ul className='nav nav-pills nav-stacked hidden-print'>
        <li className={/^\/orders\/current\/?$/.test(path) ? 'active' : ''}>
          <Link href='/orders/current'>
            Current
          </Link>
        </li>
        <li className={/^\/orders\/previous\/?$/.test(path) ? 'active' : ''}>
          <Link href='/orders/previous'>
            Previous
          </Link>
        </li>
      </ul>
    </div>
    <div className='col-md-10'>
      {children}
    </div>
  </div>
}
