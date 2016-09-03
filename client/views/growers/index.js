import React from 'react'
import Link from '../link'
import Grower from './grower'

export default ({currentUser, growers}) => {
  const {isAdmin} = currentUser || {}

  return <div>
    {isAdmin
      ? <Link href='/growers/new' className='btn btn-secondary btn-sm pull-xs-right'>
        + New Grower
      </Link>
      : ''
    }
    <h2>Growers</h2>
    <hr />
    <div className='row'>
      {growers.map((grower) => {
        return <div key={grower.id} className='col-xs-6 col-md-4 col-lg-3'>
          <Grower grower={grower} />
        </div>
      })}
    </div>
  </div>
}
