import React from 'react'
import Nav from './nav'
import Link from './link'
import Footer from './footer'
import Signin from 'ozymandias/client/views/signin'
import Message from './message'
import logoPath from 'asset-path:img/logo-small.png'

const main = (props) => {
  const {children, currentUser, statusCode} = props

  switch (statusCode) {
    case 200:
      return children

    case 401:
      return <main className='container'>
        <h1 className='text-xs-center'>
          <img src={logoPath} />
        </h1>
        {currentUser
          ? <div>
            <h1 className='text-xs-center'>Uh oh! Looks like you donʼt have access to this page.</h1>
            <p className='text-xs-center'>
              Go back to the <Link href='/'>home page</Link>?
            </p>
          </div>
          : <div>
            <p className='text-xs-center'>You need to sign in to access to this page.</p>
            <div className='row'>
              <div className='col-md-6 offset-md-3'>
                <Signin {...props} />
              </div>
            </div>
          </div>
        }
      </main>

    case 404:
      return <main className='container text-xs-center'>
        <h1>
          <img src={logoPath} />
        </h1>
        <h1>Whoops! That page doesnʼt exist.</h1>
        <p>Go back to the <Link href='/'>home page</Link>?</p>
      </main>

    case 500:
      return <main className='container text-xs-center'>
        <h1>
          <img src={logoPath} />
        </h1>
        <h1>Whoops! Something went wrong!</h1>
        <p>Go back to the <Link href='/'>home page</Link>?</p>
      </main>

    default:
      return ''
  }
}

export default (props) => {
  const {message} = props

  return <div>
    <Nav {...props} />
    <Message message={message} />
    {main(props)}
    <Footer {...props} />
  </div>
}
