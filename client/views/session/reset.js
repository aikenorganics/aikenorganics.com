import React from 'react'
import Reset from 'ozymandias/client/views/reset'

export default (props) => {
  return <main className='container'>
    <div className='row'>
      <div className='col-md-6 offset-md-3'>
        <Reset {...props} returnTo='/products' />
      </div>
    </div>
  </main>
}
