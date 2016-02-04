import React from 'react'
import moment from 'moment'

export default ({search, users}) => {
  return <div>
    <a href='/admin/users/new' className='btn btn-sm btn-default pull-right'>
      New User
    </a>
    <form className='form-inline' action='/admin/users'>
      <input type='search' className='form-control' name='search' defaultValue={search} placeholder='Search…'/>
      <span> </span>
      <a href='/admin/users/emails'>Email List</a>
    </form>
    <hr/>
    <table className='table'>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th>Email</th>
          <th>First</th>
          <th>Last</th>
          <th>Phone</th>
          <th>Member</th>
          <th>Admin</th>
        </tr>
      </thead>
      <tbody>
        {users.map(({id, email, is_admin, first, last, member_until, phone}, i) => {
          return <tr key={id}>
            <td><a className='btn btn-default btn-xs' href={`/admin/users/${id}/edit`}>Edit</a></td>
            <td>{i + 1}</td>
            <td>{email}</td>
            <td>{first || '-'}</td>
            <td>{last || '-'}</td>
            <td>{phone || '-'}</td>
            <td>
              {moment(member_until).isAfter(new Date())
                ? <span className='label label-info'>Member</span>
                : ''
              }
            </td>
            <td>
              {is_admin
                ? <span className='label label-primary'>Admin</span>
                : ''
              }
            </td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
}
