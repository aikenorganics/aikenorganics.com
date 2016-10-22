import React from 'react'
import moment from 'moment'
import Link from '../../link'

export default ({event: {action, createdAt, grower, meta, product, user}}) => {
  const link = () => {
    if (product) {
      return <Link href={`/products/${product.id}`}>{product.name}</Link>
    } else if (grower) {
      return <Link href={`/growers/${grower.id}`}>{grower.name}</Link>
    }
  }

  const actionText = () => {
    switch (action) {
      case 'create': return 'created'
      case 'update': return 'updated'
    }
  }

  return <details>
    <summary>
      {moment(createdAt).format('MM/DD/YYYY h:mma')}
      {' » '}
      <Link href={`/admin/users/${user.id}/edit`}>
        {user.name}
      </Link> {actionText()} {link()}
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
