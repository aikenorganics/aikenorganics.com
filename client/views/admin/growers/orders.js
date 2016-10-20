import React from 'react'
import Nav from './nav'
import Table from '../../growers/order-table'

export default ({growers, path}) => {
  return <div className='row'>
    <div className='col-md-2'>
      <Nav path={path} />
    </div>
    <div className='col-md-10'>
      {growers.map(({id, name, products, smallImage}) => {
        return <div key={id}>
          <div className='media'>
            <div className='media-left'>
              <img src={smallImage} className='rounded' />
            </div>
            <div className='media-body'>
              <h1>{name}</h1>
            </div>
          </div>
          <Table products={products} />
        </div>
      })}
    </div>
  </div>
}
