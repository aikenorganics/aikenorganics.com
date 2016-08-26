import React from 'react'
import Link from '../../link'
import Nav from './show-nav'
import Header from './header'
import {createUserGrower, destroyUserGrower} from '../../../actions'

export default ({busy, grower, path, users}) => {
  const create = (event) => {
    event.preventDefault()
    createUserGrower(grower.id, +event.target.value).catch(() => {})
    event.target.value = ''
  }

  const destroy = (id) => {
    destroyUserGrower(+id).catch(() => {})
  }

  const userIds = grower.userGrowers.map(({userId}) => userId)

  return <div className='row'>
    <div className='col-md-2'>
      <Nav id={grower.id} path={path} />
    </div>
    <div className='col-md-10'>
      <Header busy={busy} grower={grower} />
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h3 className='panel-title'>Users With Access</h3>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {grower.userGrowers.map(({id, user}) => {
              return <tr key={id}>
                <td>
                  <Link href={`/admin/users/${user.id}/edit`}>{user.name || '-'}</Link>
                </td>
                <td>
                  <Link href={`/admin/users/${user.id}/edit`}>{user.email}</Link>
                </td>
                <td>{user.phone || '-'}</td>
                <td>
                  <button className='btn btn-danger btn-xs' onClick={() => destroy(id)} disabled={busy}>
                    Remove
                  </button>
                </td>
              </tr>
            })}
          </tbody>
        </table>
        <div className='panel-footer'>
          <select required className='form-control' disabled={busy} onChange={(event) => create(event)}>
            <option value=''>Add a User</option>
            {users.filter(({id}) => !~userIds.indexOf(id)).map(({email, id, name}) => {
              return <option key={id} value={id}>{email} - {name}</option>
            })}
          </select>
        </div>
      </div>
    </div>
  </div>
}
