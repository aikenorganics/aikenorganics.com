import React from 'react'
import Link from '../link'
import Grower from './grower'

export default ({currentUser, growers}) => {
  const {isAdmin} = currentUser || {}

  return <div className='row'>
    <div className='col-md-2'>
      <h3>Growers</h3>
      <hr/>
      {isAdmin
        ? <div className='text-center'>
          <Link href='/growers/new' className='btn btn-default btn-xs'>
            New Grower
          </Link>
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
