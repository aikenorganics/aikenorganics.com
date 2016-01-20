import React from 'react'
import Grower from './grower'

export default ({currentUser: {is_admin}, growers}) => {
  return <div className='row'>
    <div className='col-md-2'>
      <h3>Growers</h3>
      <hr/>
      {is_admin
        ? <div className='text-center'>
          <a className='btn btn-default btn-xs' href='/growers/new'>
            New Grower
          </a>
        </div>
        : ''
      }
    </div>
    <div className='col-md-10'>
      <div className='row'>
        {growers.map((grower) => {
          return <div key={grower.id} className='col-md-6'>
            <Grower grower={grower}/>
          </div>
        })}
      </div>
    </div>
  </div>
}
