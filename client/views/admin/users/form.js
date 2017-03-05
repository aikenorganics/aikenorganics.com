import React, {PureComponent, PropTypes} from 'react'
import {createUser, navigate, updateUser} from '../../../actions'

export default class Form extends PureComponent {
  static get propTypes () {
    return {
      busy: PropTypes.bool,
      user: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    const {email, first, isAdmin, last, phone, memberUntil} = props.user || {}
    this.state = {
      email: email || '',
      first: first || '',
      isAdmin: isAdmin || false,
      last: last || '',
      phone: phone || '',
      memberUntil: memberUntil || ''
    }
  }

  save (event) {
    event.preventDefault()
    if (this.props.user) {
      const {id} = this.props.user
      updateUser(id, this.state).catch(() => {})
    } else {
      createUser(this.state).then(({user}) => {
        navigate(`/admin/users/${user.id}/edit`)
      }).catch(() => {})
    }
  }

  render () {
    const {busy, user} = this.props
    const {email, first, isAdmin, last, memberUntil, phone} = this.state

    return <form onSubmit={(event) => this.save(event)}>
      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input autoFocus type='text' id='email' className='form-control' value={email} onChange={(event) => this.setState({email: event.target.value})} />
      </div>
      <div className='form-group'>
        <label htmlFor='first'>First Name</label>
        <input type='text' id='first' className='form-control' value={first} onChange={(event) => this.setState({first: event.target.value})} />
      </div>
      <div className='form-group'>
        <label htmlFor='last'>Last Name</label>
        <input type='text' id='last' className='form-control' value={last} onChange={(event) => this.setState({last: event.target.value})} />
      </div>
      <div className='form-group'>
        <label htmlFor='phone'>Phone Number</label>
        <input type='text' id='phone' className='form-control' value={phone} onChange={(event) => this.setState({phone: event.target.value})} />
      </div>
      <div className='form-group'>
        <label htmlFor='memberUntil'>Member Until</label>
        <input type='date' id='memberUntil' className='form-control' value={(memberUntil || '').slice(0, 10)} onChange={(event) => this.setState({memberUntil: event.target.value})} />
      </div>
      {user
        ? <div className='form-check'>
          <label className='form-check-label'>
            <input className='form-check-input' type='checkbox' checked={isAdmin} onChange={(event) => this.setState({isAdmin: event.target.checked})} />
            <span> Admin</span>
          </label>
        </div>
        : ''
      }
      <div className='form-group'>
        <button type='submit' className='btn btn-success' disabled={busy}>
          Save
        </button>
      </div>
    </form>
  }
}
