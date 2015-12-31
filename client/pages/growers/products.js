import app from '../app'
import React from 'react'
import Products from '../../views/growers/products'

export default app((state, actions) => {
  const {grower, products} = state
  const {update} = actions
  return (
    <Products grower={grower} products={products} update={update}/>
  )
})
