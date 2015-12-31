import React from 'react'
import SubNav from './subnav'

export default ({cart, market, user, path, children}) => {
  return <main className='container'>
    <SubNav cart={cart} user={user} open={market.open} path={path}/>
    {children}
  </main>
}
