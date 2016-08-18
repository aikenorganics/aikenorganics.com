import React, {PureComponent} from 'react'
import Link from '../link'
import Errors from '../errors'
import {navigate, reset} from '../../actions'

export default class Reset extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      password: ''
    }
  }

  submit (event) {
    event.preventDefault()
    const {token} = this.props
    reset(token, this.state).then(() => {
      navigate('/products')
    }).catch(() => {})
  }

  render () {
    const {busy, email, errors, expired, token} = this.props
    const {password} = this.state

    return <main className='container'>
      <form onSubmit={(event) => this.submit(event)}>
        <div className='panel panel-default panel-small'>
          <div className='panel-heading'>
            <h3 className='panel-title'>Reset Password</h3>
          </div>
          <div className='panel-body'>
            {expired
              ? <div>
                <h3>Sorry! That token is expired.</h3>
                <p>
                  Would you like us to <Link href='/signin/forgot'>send you another one</Link>?
                </p>
              </div>
              : <div className='form-group'>
                <label htmlFor='password'>New Password for {email || ''}</label>
                <input type='password' id='password' className='form-control' required autoFocus
                  value={password} onChange={(event) => this.setState({password: event.target.value})} />
              </div>
            }
            <Errors errors={errors} />
          </div>
          {token
            ? <div className='panel-footer text-right'>
              <button className='btn btn-success' disabled={busy}>
                Reset Password
              </button>
            </div>
            : ''
          }
        </div>
      </form>
    </main>
  }

}
