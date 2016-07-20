import React from 'react'
import Signin from './signin/index'
import assets from 'ozymandias/assets/index'

const main = (props) => {
  const {children, currentUser, statusCode} = props

  switch (statusCode) {
    case 200:
      return children

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

const footer = () => {
  return <div className='footer hidden-print'>
    <div className='container'>
      <div className='row'>
        <div className='col-md-4'>
          <h2>
            <img src={assets.path('img/logo-small.png')}/>
          </h2>
        </div>
        <div className='col-md-4'>
          <h2>Contact</h2>
          <p>
            <strong>Phone:</strong> (803) 920-7153
            <br/>
            <strong>Email:</strong> <a href='mailto:support@aikenorganics.com'>support@aikenorganics.com</a>
          </p>
        </div>
        <div className='col-md-4'>
          <h2>Social</h2>
          <p>
            <a href='https://twitter.com/aikenorganics'>
              <img src={assets.path('img/twitter-32.png')}/>
              &nbsp;@aikenorganics
            </a>
          </p>
          <p>
            <a href='https://www.facebook.com/aikenorganics'>
              <img src={assets.path('img/facebook-3-32.png')}/>
              &nbsp;@aikenorganics
            </a>
          </p>
          <p>
            <a href='https://instagram.com/aikenorganics'>
              <img src={assets.path('img/instagram-32.png')}/>
              &nbsp;@aikenorganics
            </a>
          </p>
        </div>
      </div>
      <hr/>
      <div className='colophon'>
        <p>© Aiken Organics</p>
      </div>
    </div>
  </div>
}

export default (props) => {
  return <div>
    {main(props)}
    {footer(props)}
  </div>
}
