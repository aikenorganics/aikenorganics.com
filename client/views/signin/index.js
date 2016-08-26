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
      <form onSubmit={(event) => this.submit(event)}>
        <div className='panel panel-default panel-small'>
          <div className='panel-heading'>
            <h3 className='panel-title'>Sign In</h3>
          </div>
          <div className='panel-body'>
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
          </div>
          <div className='panel-footer text-right'>
            <Link href='/signin/forgot'>Forgot Password</Link> <button className='btn btn-primary' disabled={busy}>
              Sign In
            </button>
          </div>
        </div>
      </form>
    </main>
  }

}
