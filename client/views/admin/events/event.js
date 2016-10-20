import React from 'react'
import moment from 'moment'
import Link from '../../link'

export default ({event: {action, createdAt, meta, user, target}}) => {
  return <details>
    <summary>
      {moment(createdAt).format('MM/DD/YYYY h:mma')} -
      <Link href={`/admin/users/${user.id}/edit`}>{user.name}</Link> -
      {action} {target}
    </summary>
    <div className='table-responsive'>
      <table className='table table-sm'>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(meta).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{JSON.stringify(meta[key])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </details>
}
