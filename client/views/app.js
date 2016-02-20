import React from 'react'
import marked from 'marked'

export default ({cart, children, market: {message, open}, currentUser, path}) => {
  const cartSize = Object.keys(cart).reduce((total, id) => total + cart[id], 0)

  return <main className='container'>
    <div className='hidden-print'>
      {open
        ? <div className='alert alert-info' dangerouslySetInnerHTML={{__html: marked(message)}}></div>
        : <div className='alert alert-warning text-center'>
          <p>
            <strong>The market is currently closed and will re-open on Sunday at 8:00AM. </strong>
            If you need help in the meantime, feel free to drop us a line
            at <a href='mailto:support@aikenorganics.com'>support@aikenorganics.com</a>.
          </p>
        </div>
      }
      <ul className='nav nav-tabs subnav'>
        <li className={/^\/products/.test(path) ? 'active' : ''}>
          <a href='/products'>Products</a>
        </li>
        <li className={/^\/growers/.test(path) ? 'active' : ''}>
          <a href='/growers'>Growers</a>
        </li>
        {!currentUser || !open ? ''
          : <li className={/^\/cart/.test(path) ? 'active' : ''}>
            <a href='/cart'>
              Cart <span id='cart-size' className='badge'>{cartSize}</span>
            </a>
          </li>
        }
        {!currentUser ? ''
          : <li className={/^\/orders/.test(path) ? 'active' : ''}>
            <a href='/orders/current'>
              Orders
            </a>
          </li>
        }
      </ul>
    </div>
    {children}
  </main>
}
