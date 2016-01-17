import React, {Component, PropTypes} from 'react'
import {updateUser} from '../../../actions'

export default class Form extends Component {

  static get propTypes () {
    return {
      user: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    const {email, first, is_admin, last, phone, member_until} = props.user
    this.state = {
      email,
      first,
      is_admin,
      last,
      phone,
      member_until
    }
  }

  save (e) {
    e.preventDefault()
    const {id} = this.props.user
    updateUser(id, this.state)
  }

  render () {
    const {email, first, is_admin, last, member_until, phone} = this.state

    return <form onSubmit={(e) => this.save(e)}>
      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input autoFocus type='text' id='email' className='form-control' value={email} onChange={(e) => this.setState({email: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='first'>First Name</label>
        <input type='text' id='first' className='form-control' value={first} onChange={(e) => this.setState({first: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='last'>Last Name</label>
        <input type='text' id='last' className='form-control' value={last} onChange={(e) => this.setState({last: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='phone'>Phone Number</label>
        <input type='text' id='phone' className='form-control' value={phone} onChange={(e) => this.setState({phone: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='member_until'>Member Until</label>
        <input type='date' id='member_until' className='form-control' value={(member_until || '').slice(0, 10)} onChange={(e) => this.setState({member_until: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label>
          <input type='checkbox' value='1' checked={is_admin} onChange={(e) => this.setState({is_admin: e.target.checked})}/>
          <span> Admin</span>
        </label>
      </div>
      <div className='form-group'>
        <button type='submit' className='btn btn-primary'>
          Save
        </button>
      </div>
    </form>
  }

}
