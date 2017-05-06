import React from 'react'
import Search from '../../search'
import Link from '../../link'
import Pagination from '../../pagination'
import {findOrCreateOrder, navigate} from '../../../actions'

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
            <th>Email</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Member</th>
            <th>Admin</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map(({id, email, isAdmin, memberUntil, name, phone}) => {
            const toOrder = (event) => {
              findOrCreateOrder(id).then(({id}) => {
                navigate(`/admin/orders/${id}`)
              }).catch(() => {})
            }
            return <tr key={id}>
              <td>{email}</td>
              <td>{name}</td>
              <td>{phone || '-'}</td>
              <td>
                {new Date(memberUntil) > new Date()
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
              <td className='text-nowrap'>
                <Link href={`/admin/users/${id}/edit`} className='btn btn-sm btn-secondary'>
                  Edit
                </Link>
                {' '}
                <button className='btn btn-sm btn-secondary' onClick={toOrder}>
                  Order
                </button>
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
