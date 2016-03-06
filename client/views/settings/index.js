import React, {Component} from 'react'
import {updateSettings} from '../../actions'
import Billing from '../users/billing'

export default class Index extends Component {

  constructor (props) {
    super(props)
    const {first, last, phone} = props.currentUser
    this.state = {
      first,
      last,
      phone
    }
  }

  save (e) {
    e.preventDefault()
    updateSettings(this.state).catch((e) => {})
  }

  render () {
    const {busy, currentUser} = this.props
    const {stripe_id, card_brand, card_last4} = currentUser
    const {first, last, phone} = this.state

    return <div>
      <h1>Settings</h1>
      <form onSubmit={(e) => this.save(e)}>
        <div className='form-group'>
          <label htmlFor='first'>First Name</label>
          <input autoFocus type='text' className='form-control' value={first} onChange={(e) => this.setState({first: e.target.value})}/>
        </div>
        <div className='form-group'>
          <label htmlFor='last'>Last Name</label>
          <input type='text' className='form-control' value={last} onChange={(e) => this.setState({last: e.target.value})}/>
        </div>
        <div className='form-group'>
          <label htmlFor='phone'>Phone Number</label>
          <input type='text' className='form-control' value={phone} onChange={(e) => this.setState({phone: e.target.value})}/>
        </div>
        <div className='form-group'>
          <button type='submit' className='btn btn-primary' disabled={busy}>
            Save
          </button>
        </div>
      </form>
      <hr/>
      <h1>Billing</h1>
      <p>
        {stripe_id
          ? <span>The card associated with your account is a {card_brand} ending in {card_last4}.</span>
          : <span>There is currently no card associated with your account.</span>
        }
      </p>
      <Billing busy={busy} user={currentUser}/>
    </div>
  }

}
