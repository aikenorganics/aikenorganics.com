import React from 'react'
import Link from '../../link'
import Row from './row'

export default ({busy, locations}) => {
  return <div>
    <h1>
      <span>Locations </span>
      <Link href='/admin/locations/new' className='btn btn-secondary btn-sm'>
        New Location
      </Link>
    </h1>
    <hr />
    <div className='table-responsive'>
      <table className='table'>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => {
            return <Row busy={busy} key={location.id} location={location} />
          })}
        </tbody>
      </table>
    </div>
  </div>
}
