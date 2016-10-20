import React from 'react'
import Nav from './nav'
import Table from './order-table'

export default ({canEdit, grower, path, products}) => {
  const {mediumImage} = grower

  return <div className='row'>
    <div className='col-md-3 text-xs-center'>
      <p>
        <img className='rounded img-fluid' src={mediumImage} />
      </p>
      <Nav canEdit={canEdit} grower={grower} path={path} />
    </div>
    <div className='col-md-9'>
      <Table products={products} />
    </div>
  </div>
}
