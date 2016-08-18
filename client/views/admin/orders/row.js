import moment from 'moment'
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
    <td><Status order={order}/></td>
    <td>
      {moment(user.memberUntil).isSameOrAfter(new Date())
        ? <span className='label label-info' title={`Until ${moment(user.memberUntil).format('MM/DD/YYYY')}`}>
          Member
        </span>
        : ''
      }
    </td>
  </tr>
}
