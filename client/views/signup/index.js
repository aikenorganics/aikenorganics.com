import React, {PureComponent} from 'react'
import Errors from '../errors'
import {navigate, signup} from '../../actions'

export default class Index extends PureComponent {

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

  submit (event) {
    event.preventDefault()
    signup(this.state).then(() => {
      navigate('/products')
    }).catch(() => {})
  }

  render () {
    const {busy, errors} = this.props
    const {email, first, last, password, phone} = this.state

    return <main className='container'>
      <form onSubmit={(event) => this.submit(event)}>
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
                    value={first} onChange={(event) => this.setState({first: event.target.value})} />
                </div>
                <div className='col-md-6'>
                  <label htmlFor='last'>Last Name</label>
                  <input type='text' id='last' className='form-control' required
                    value={last} onChange={(event) => this.setState({last: event.target.value})} />
                </div>
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='phone'>Phone</label>
              <input type='text' id='phone' className='form-control' required
                value={phone} onChange={(event) => this.setState({phone: event.target.value})} />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type='text' id='email' className='form-control' placeholder='you@example.com' required
                value={email} onChange={(event) => this.setState({email: event.target.value})} />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' className='form-control' required
                value={password} onChange={(event) => this.setState({password: event.target.value})} />
            </div>
            <Errors errors={errors} />
          </div>
          <div className='panel-footer text-right'>
            <button className='btn btn-success' disabled={busy}>
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </main>
  }

}
