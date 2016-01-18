import React from 'react'

export default ({emails}) => {
  return <div>
    <h1>User Emails</h1>
    <a href='/admin/users'>
      Full List
    </a>
    <hr/>
    <textarea rows='30' className='form-control' defaultValue={emails.join('\n')}/>
  </div>
}
