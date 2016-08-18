import React from 'react'
import Link from '../../link'

export default ({emails}) => {
  return <div>
    <h1>User Emails</h1>
    <Link href='/admin/users'>
      Full List
    </Link>
    <hr />
    <textarea rows='30' className='form-control' defaultValue={emails.join('\n')} />
  </div>
}
