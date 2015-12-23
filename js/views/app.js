import React from 'react'
import SubNav from './subnav'

export default function ({cart, market, user, children}) {
  return <main className='container'>
    <SubNav cart={cart} user={user} open={market.open}/>
    {children}
  </main>
}
