import React from 'react'
import Row from './row'

export default ({locations}) => {
  return <div>
    <h1>
      Locations
      <a className='btn btn-default btn-xs' href='/admin/locations/new'>
        New Location
      </a>
    </h1>
    <hr/>
    <table className='table'>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {locations.map((location) => {
          return <Row key={location.id} location={location}/>
        })}
      </tbody>
    </table>
  </div>
}
