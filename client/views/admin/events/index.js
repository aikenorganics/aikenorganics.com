import React from 'react'
import Event from './event'
import Pagination from '../../pagination'
import {navigate} from '../../../actions'
import {set} from 'ozymandias/client/querystring'

export default ({events, more, page, url, userId, users}) => {
  const changeUser = ({target}) => {
    navigate(set(url, {page: null, userId: target.value || null}))
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
