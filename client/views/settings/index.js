import React, {Component} from 'react'
import Errors from '../errors'
import Billing from '../users/billing'
import {updateSettings} from '../../actions'

export default class Index extends Component {

  constructor (props) {
    super(props)
    const {first, last, phone, street, city, state, zip} = props.currentUser
    this.state = {
      first,
      last,
      phone,
      street,
      city,
      state,
      zip
    }
  }

  save (e) {
    e.preventDefault()
    const {first, last, phone, street, city, state, zip} = this.state
    updateSettings({
      first,
      last,
      phone,
      street: street || null,
      city: city || null,
      state: state || null,
      zip: zip || null
    }).catch((e) => {})
  }

  render () {
    const {busy, currentUser, errors} = this.props
    const {stripe_id, card_brand, card_last4} = currentUser
    const {first, last, phone, street, city, state, zip} = this.state

    return <div>
      <h1>Settings</h1>
      <form onSubmit={(e) => this.save(e)}>
        <Errors errors={errors}/>
        <div className='row'>
          <div className='form-group col-md-4'>
            <label htmlFor='first'>First Name</label>
            <input autoFocus id='first' type='text' className='form-control' value={first} onChange={(e) => this.setState({first: e.target.value})}/>
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='last'>Last Name</label>
            <input type='text' id='last' className='form-control' value={last} onChange={(e) => this.setState({last: e.target.value})}/>
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='phone'>Phone Number</label>
            <input type='text' id='phone' className='form-control' value={phone} onChange={(e) => this.setState({phone: e.target.value})}/>
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='street'>Street</label>
          <input type='text' id='street' className='form-control' value={street || ''} onChange={(e) => this.setState({street: e.target.value})}/>
        </div>
        <div className='row'>
          <div className='form-group col-md-6'>
            <label htmlFor='city'>City</label>
            <input type='text' id='city' className='form-control' value={city || ''} onChange={(e) => this.setState({city: e.target.value})}/>
          </div>
          <div className='form-group col-md-2'>
            <label htmlFor='state'>State</label>
            <input type='text' id='state' className='form-control' value={state || ''} onChange={(e) => this.setState({state: e.target.value})}/>
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='zip'>Zip</label>
            <input type='text' id='zip' className='form-control' value={zip || ''} onChange={(e) => this.setState({zip: e.target.value})}/>
          </div>
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
