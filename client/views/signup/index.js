import React, {Component} from 'react'
import Errors from '../errors'
import {signup} from '../../actions/index'

export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      first: '',
      last: '',
      password: '',
      phone: ''
    }
  }

  submit (e) {
    e.preventDefault()
    signup(this.state).then(() => {
      window.location = '/products'
    }).catch(() => {})
  }

  render () {
    const {busy, errors} = this.props
    const {email, first, last, password, phone} = this.state

    return <div>
      <form onSubmit={(e) => this.submit(e)}>
        <div className='panel panel-default panel-small'>
          <div className='panel-heading'>
            <h3 className='panel-title'>Sign Up</h3>
          </div>
          <div className='panel-body'>
            <div className='form-group'>
              <div className='row'>
                <div className='col-md-6'>
                  <label htmlFor='first'>First Name</label>
                  <input type='text' id='first' className='form-control' autoFocus required
                    value={first} onChange={(e) => this.setState({first: e.target.value})}/>
                </div>
                <div className='col-md-6'>
                  <label htmlFor='last'>Last Name</label>
                  <input type='text' id='last' className='form-control' required
                    value={last} onChange={(e) => this.setState({last: e.target.value})}/>
                </div>
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='phone'>Phone</label>
              <input type='text' id='phone' className='form-control' required
                value={phone} onChange={(e) => this.setState({phone: e.target.value})}/>
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type='text' id='email' className='form-control' placeholder='you@example.com' required
                value={email} onChange={(e) => this.setState({email: e.target.value})}/>
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' className='form-control' required
                value={password} onChange={(e) => this.setState({password: e.target.value})}/>
            </div>
            <Errors errors={errors}/>
          </div>
          <div className='panel-footer text-right'>
            <button className='btn btn-success' disabled={busy}>
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  }

}
