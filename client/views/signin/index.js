import React from 'react'
import Signin from 'ozymandias/client/views/signin'

export default (props) => {
  return <main className='container'>
    <div className='row'>
      <div className='col-md-6 offset-md-3'>
        <Signin {...props} returnTo='/products' />
      </div>
    </div>
  </main>
}
