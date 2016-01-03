import React from 'react'
import Tabs from './tabs'

export default ({state: {cart, market, user, path}, children}) => {
  return <main className='container'>
    <Tabs cart={cart} user={user} open={market.open} path={path}/>
    {children}
  </main>
}
