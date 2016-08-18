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
      <form onSubmit={(event) => this.submit(event)}>
        <div className='panel panel-default panel-small'>
          <div className='panel-heading'>
            <h3 className='panel-title'>Forgot Password</h3>
          </div>
          <div className='panel-body'>
            <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type='text' id='email' className='form-control' placeholder='you@example.com' required autoFocus
                value={email} onChange={(event) => this.setState({email: event.target.value})} />
            </div>
            <Errors errors={errors} />
          </div>
          <div className='panel-footer text-right'>
            <button className='btn btn-success' disabled={busy}>
              Email My Password
            </button>
          </div>
        </div>
      </form>
    </main>
  }

}
