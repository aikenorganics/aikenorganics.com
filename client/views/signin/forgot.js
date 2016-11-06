import React from 'react'
import Forgot from 'ozymandias/client/views/forgot'

export default (props) => {
  return <main className='container'>
    <div className='row'>
      <div className='col-md-6 offset-md-3'>
        <Forgot {...props} />
      </div>
    </div>
  </main>
}
