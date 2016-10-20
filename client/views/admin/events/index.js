import React from 'react'
import Event from './event'
import Pagination from '../../pagination'

export default ({events, more, page, url}) => {
  return <div>
    <h1>Events</h1>
    {events.map((event) => <Event key={event.id} event={event} />)}
    <hr />
    <Pagination more={more} page={page} url={url} />
  </div>
}
