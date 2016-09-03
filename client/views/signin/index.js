import React, {PureComponent} from 'react'
import Link from '../link'
import Errors from '../errors'
import {navigate, signin} from '../../actions'

export default class Index extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  submit (event) {
    event.preventDefault()
    signin(this.state).then(() => {
      navigate('/products')
    }).catch(() => {})
  }

  render () {
    const {busy, errors} = this.props
    const {email, password} = this.state

    return <main className='container'>
      <div className='row'>
        <form onSubmit={(event) => this.submit(event)} className='col-md-6 offset-md-3'>
          <h3>Sign In</h3>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='text' id='email' className='form-control' placeholder='you@example.com' required autoFocus
              value={email} onChange={(event) => this.setState({email: event.target.value})} />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' className='form-control' required
              value={password} onChange={(event) => this.setState({password: event.target.value})} />
          </div>
          <Errors errors={errors} />
          <div className='text-xs-right'>
            <Link href='/signin/forgot'>Forgot Password</Link> <button className='btn btn-primary' disabled={busy}>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </main>
  }

}
