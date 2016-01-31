import React from 'react'
import Table from '../../growers/order-table'

export default ({growers}) => {
  return <div>
    {growers.map((grower) => {
      const {id, name, smallImage} = grower
      return <div key={id}>
        <div className='media'>
          <div className='media-left'>
            <img src={smallImage} className='img-rounded'
              style={{maxWidth: '100px', maxHeight: '100px'}}/>
          </div>
          <div className='media-body'>
            <h1>{name}</h1>
          </div>
        </div>
        <hr/>
        <Table products={grower.products}/>
      </div>
    })}
  </div>
}
