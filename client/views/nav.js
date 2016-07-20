import React from 'react'
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
      {is_admin ? <li><a href='/admin/users'>Admin</a></li> : ''}
      <li>
        <a href='/settings'>Settings</a>
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
        <a className='navbar-brand' href='/'>
          <strong>Aiken Organics</strong>
        </a>
      </div>
      <div className='collapse navbar-collapse' id='navbar-collapse'>
        <ul className='nav navbar-nav'>
          <li>
            <a href='/'>Home</a>
          </li>
          <li>
            <a href='/#about'>About</a>
          </li>
          <li>
            <a href='/learn'>Learn More</a>
          </li>
          <li>
            <a href='/products'>Market</a>
          </li>
          <User currentUser={currentUser}/>
          {currentUser ? null : <li><a href='/signin'>Sign In</a></li>}
          {currentUser ? null : <li><a href='/signup'>Sign Up</a></li>}
        </ul>
      </div>
    </div>
  </nav>
}
