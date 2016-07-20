import React from 'react'
import Link from './link'
import Message from './message'

const User = ({currentUser}) => {
  if (!currentUser) return null

  const {email, is_admin, name} = currentUser

  return <li>
    <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button'>
      Account
      <span className='caret'></span>
    </a>
    <ul className='dropdown-menu' role='menu'>
      <li id='current-user' className='dropdown-header'>
        {name ? <span>{name}<br/></span> : ''}
        {email}
      </li>
      {is_admin ? <li><Link href='/admin/users'>Admin</Link></li> : ''}
      <li>
        <Link href='/settings'>Settings</Link>
      </li>
      <li>
        <a href='/auth/signout'>Sign Out</a>
      </li>
    </ul>
  </li>
}

export default (props) => {
  const {currentUser, message} = props

  return <nav className='navbar navbar-inverse navbar-fixed-top'>
    <Message message={message}/>
    <div className='container'>
      <div className='navbar-header'>
        <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar-collapse'>
          <span className='sr-only'>Toggle navigation</span>
          <span className='icon-bar'></span>
          <span className='icon-bar'></span>
          <span className='icon-bar'></span>
        </button>
        <Link className='navbar-brand' href='/'>
          <strong>Aiken Organics</strong>
        </Link>
      </div>
      <div className='collapse navbar-collapse' id='navbar-collapse'>
        <ul className='nav navbar-nav'>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/#about'>About</Link>
          </li>
          <li>
            <Link href='/learn'>Learn More</Link>
          </li>
          <li>
            <Link href='/products'>Market</Link>
          </li>
          <User currentUser={currentUser}/>
          {currentUser ? null : <li><Link href='/signin'>Sign In</Link></li>}
          {currentUser ? null : <li><Link href='/signup'>Sign Up</Link></li>}
        </ul>
      </div>
    </div>
  </nav>
}
