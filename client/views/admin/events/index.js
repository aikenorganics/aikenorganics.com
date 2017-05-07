import React from 'react'
import Event from './event'
import Pagination from '../../pagination'
import {navigate} from '../../../actions'

export default ({events, more, page, url, userId, users}) => {
  const changeUser = ({target}) => {
    const next = new window.URL(url)
    next.searchParams.delete('page')
    if (!target.value) next.searchParams.delete('userId')
    else next.searchParams.set('userId', target.value)
    navigate(next.toString())
  }

  return <div>
    <h1>Events</h1>
    <form className='hidden-print'>
      <div className='form-group'>
        <label htmlFor='userId'>User</label>
        <select id='userId' className='form-control' onChange={changeUser} value={userId || ''}>
          <option value=''>Filter by User</option>
          {users.map(({id, email}) => (
            <option key={id} value={id}>{email}</option>
          ))}
        </select>
      </div>
    </form>
    <hr />
    {events.map((event) => <Event key={event.id} event={event} />)}
    <hr />
    <Pagination more={more} page={page} url={url} />
  </div>
}
