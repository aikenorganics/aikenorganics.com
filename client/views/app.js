import React from 'react'
import Signin from './signin/index'
import assets from 'ozymandias/assets/index'

export default (props) => {
  const {children, currentUser, statusCode} = props

  switch (statusCode) {
    case 200:
      return <main className='container'>
        {children}
      </main>

    case 401:
      return <main className='container'>
        <h1 className='text-center'>
          <img src={assets.path('img/logo-small.png')}/>
        </h1>
        {currentUser
          ? <div>
            <h1 className='text-center'>Uh oh! Looks like you donʼt have access to this page.</h1>
            <p className='text-center'>
              Go back to the <a href='/'>home page</a>?
            </p>
          </div>
          : <div>
            <p className='text-center'>You need to sign in to access to this page.</p>
            <Signin {...props}/>
          </div>
        }
      </main>

    case 404:
      return <main className='container text-center'>
        <h1>
          <img src={assets.path('img/logo-small.png')}/>
        </h1>
        <h1>Whoops! That page doesnʼt exist.</h1>
        <p>Go back to the <a href='/'>home page</a>?</p>
      </main>

    case 500:
      return <main className='container text-center'>
        <h1>
          <img src={assets.path('img/logo-small.png')}/>
        </h1>
        <h1>Whoops! Something went wrong!</h1>
        <p>Go back to the <a href='/'>home page</a>?</p>
      </main>

    default:
      return ''
  }
}
