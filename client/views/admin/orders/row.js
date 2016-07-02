import moment from 'moment'
import React from 'react'
import Status from './status'

export default ({order}) => {
  const {id, user} = order
  return <tr>
    <td><a href={`/admin/orders/${id}`}>#{id}</a></td>
    <td>{user.name}</td>
    <td>{user.email}</td>
    <td>{user.phone || '-'}</td>
    <td><Status order={order}/></td>
    <td>
      {moment(user.member_until).isSameOrAfter(new Date())
        ? <span className='label label-info' title={`Until ${moment(user.member_until).format('MM/DD/YYYY')}`}>
          Member
        </span>
        : ''
      }
    </td>
  </tr>
}
