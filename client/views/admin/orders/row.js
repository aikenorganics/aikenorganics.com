import React from 'react'
import Link from '../../link'
import Status from './status'

export default ({order}) => {
  const {id, user} = order
  return <tr>
    <td><Link href={`/admin/orders/${id}`}>#{id}</Link></td>
    <td>{user.name}</td>
    <td>{user.email}</td>
    <td>{user.phone || '-'}</td>
    <td><Status order={order} /></td>
    <td>
      {new Date(user.memberUntil) >= new Date()
        ? <span className='tag tag-info' title={`Until ${new Date(user.memberUntil).toLocaleDateString('en', {timeZone: 'America/New_York'})}`}>
          Member
        </span>
        : ''
      }
    </td>
  </tr>
}
