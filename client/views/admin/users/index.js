import React from 'react'
import moment from 'moment'
import Search from '../../search'
import Link from '../../link'
import {params} from '../../../url'

export default ({more, page, search, url, users}) => {
  return <div>
    <Link href='/admin/users/new' className='btn btn-sm btn-default pull-right'>
      New User
    </Link>
    <div style={{display: 'inline-block'}}>
      <Search url='/admin/users' value={search}/>
    </div>
    &nbsp;
    <Link href='/admin/users/emails'>Email List</Link>
    <hr/>
    <table className='table'>
      <thead>
        <tr>
          <th></th>
          <th>Email</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Member</th>
          <th>Admin</th>
        </tr>
      </thead>
      <tbody>
        {users.map(({id, email, is_admin, member_until, name, phone}) => {
          return <tr key={id}>
            <td>
              <Link href={`/admin/users/${id}/edit`} className='btn btn-default btn-xs'>
                Edit
              </Link>
            </td>
            <td>{email}</td>
            <td>{name}</td>
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
    <hr/>
    {more
      ? <Link href={params(url, {page: page + 1})} className='pull-right'>
        Next Page →
      </Link>
      : ''
    }
    {page > 1
      ? <Link href={params(url, {page: page - 1})}>
        ← Previous Page
      </Link>
      : ''
    }
  </div>
}
