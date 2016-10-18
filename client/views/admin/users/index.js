import React from 'react'
import moment from 'moment'
import Search from '../../search'
import Link from '../../link'
import Pagination from '../../pagination'

export default ({more, page, search, url, users}) => {
  return <div>
    <Link href='/admin/users/new' className='btn btn-secondary'>
      New User
    </Link> <div className='d-inline-block'>
      <Search url='/admin/users' value={search} inline />
    </div> <Link href='/admin/users/emails'>Email List</Link>
    <hr />
    <div className='table-responsive'>
      <table className='table'>
        <thead>
          <tr>
            <th />
            <th>Email</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Member</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({id, email, isAdmin, memberUntil, name, phone}) => {
            return <tr key={id}>
              <td>
                <Link href={`/admin/users/${id}/edit`} className='btn btn-link btn-sm'>
                  Edit
                </Link>
              </td>
              <td>{email}</td>
              <td>{name}</td>
              <td>{phone || '-'}</td>
              <td>
                {moment(memberUntil).isAfter(new Date())
                  ? <span className='tag tag-info'>Member</span>
                  : ''
                }
              </td>
              <td>
                {isAdmin
                  ? <span className='tag tag-primary'>Admin</span>
                  : ''
                }
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
    <hr />
    <Pagination more={more} page={page} url={url} />
  </div>
}
