import React from 'react'
import Link from './link'

export default ({cart, children, market: {messageHtml, open}, currentUser, path}) => {
  const cartSize = Object.keys(cart).reduce((total, id) => total + cart[id], 0)

  return <main className='container'>
    <div className='hidden-print'>
      {open
        ? <div className='alert alert-info' dangerouslySetInnerHTML={{__html: messageHtml}} />
        : <div className='alert alert-warning text-xs-center'>
          <p>
            <strong>The market is currently closed and will re-open on Sunday at 8:00AM. </strong>
            If you need help in the meantime, feel free to drop us a line
            at <a href='mailto:support@aikenorganics.com'>support@aikenorganics.com</a>.
          </p>
        </div>
      }
      <ul className='nav nav-tabs'>
        <li className='nav-item'>
          <Link className={`nav-link${/^\/products/.test(path) ? ' active' : ''}`} href='/products'>Products</Link>
        </li>
        <li className='nav-item'>
          <Link className={`nav-link${/^\/growers/.test(path) ? ' active' : ''}`} href='/growers'>Growers</Link>
        </li>
        {!currentUser || !open ? ''
          : <li className='nav-item'>
            <Link className={`nav-link${/^\/cart/.test(path) ? ' active' : ''}`} href='/cart'>
              Cart <span className='tag tag-pill tag-info'>{cartSize}</span>
            </Link>
          </li>
        }
        {!currentUser ? ''
          : <li className='nav-item'>
            <Link className={`nav-link${/^\/orders/.test(path) ? ' active' : ''}`} href='/orders/current'>
              Orders
            </Link>
          </li>
        }
      </ul>
    </div>
    {children}
  </main>
}
