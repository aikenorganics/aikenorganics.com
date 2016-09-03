import React, {PureComponent} from 'react'
import Errors from '../errors'
import {forgot, setMessage} from '../../actions'

export default class Forgot extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
  }

  submit (event) {
    event.preventDefault()
    forgot(this.state).then(() => {
      setMessage('success', 'Thanks! We sent you an email to reset your password.')
    }).catch(() => {})
  }

  render () {
    const {busy, errors} = this.props
    const {email} = this.state

    return <main className='container'>
      <div className='row'>
        <form onSubmit={(event) => this.submit(event)} className='col-md-6 offset-md-3'>
          <h3>Forgot Password</h3>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='text' id='email' className='form-control' placeholder='you@example.com' required autoFocus
              value={email} onChange={(event) => this.setState({email: event.target.value})} />
          </div>
          <Errors errors={errors} />
          <div className='text-xs-right'>
            <button className='btn btn-success' disabled={busy}>
              Email My Password
            </button>
          </div>
        </form>
      </div>
    </main>
  }

}
