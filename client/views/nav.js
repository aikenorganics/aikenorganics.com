import React from 'react'
import Link from './link'
import {navigate, signout} from '../actions'

export default ({currentUser}) => {
  const {isAdmin} = currentUser || {}

  const handleSignout = (event) => {
    event.preventDefault()
    signout().then(() => navigate('/'))
  }

  return <nav className='navbar navbar-dark bg-inverse navbar-fixed-top'>
    <div className='container'>
      <ul className='nav navbar-nav'>
        <li className='nav-item'>
          <Link className='nav-link' href='/'>Home</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' href='/#about'>About</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' href='/learn'>Learn</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' href='/market'>Market</Link>
        </li>
        {currentUser
          ? <li className='nav-item'>
            <Link className='nav-link' href='/settings'>Settings</Link>
          </li>
          : null
        }
        {isAdmin
          ? <li className='nav-item'>
            <Link className='nav-link' href='/admin/users'>Admin</Link>
          </li>
          : null
        }
        {currentUser
          ? <li className='nav-item'>
            <a className='nav-link' id='signout' href='/session' onClick={handleSignout}>
              Sign Out
            </a>
          </li>
          : null
        }
        {currentUser
          ? null
          : <li className='nav-item'>
            <Link className='nav-link' href='/session/signin'>Sign In</Link>
          </li>
        }
        {currentUser
          ? null
          : <li className='nav-item'>
            <Link className='nav-link' href='/signup'>Sign Up</Link>
          </li>
        }
      </ul>
    </div>
  </nav>
}
