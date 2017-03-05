import React, {PureComponent} from 'react'
import Errors from '../errors'
import Billing from '../users/billing'
import {updateSettings} from '../../actions'

export default class Index extends PureComponent {
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

  save (event) {
    event.preventDefault()
    const {first, last, phone, street, city, state, zip} = this.state
    updateSettings({
      first,
      last,
      phone,
      street: street || null,
      city: city || null,
      state: state || null,
      zip: zip || null
    }).catch(() => {})
  }

  render () {
    const {busy, currentUser, errors, stripeKey} = this.props
    const {stripeId, cardBrand, cardLast4} = currentUser
    const {first, last, phone, street, city, state, zip} = this.state

    return <div>
      <h1>Settings</h1>
      <form onSubmit={(event) => this.save(event)}>
        <Errors errors={errors} />
        <div className='row'>
          <div className='form-group col-md-4'>
            <label htmlFor='first'>First Name</label>
            <input autoFocus id='first' type='text' className='form-control' value={first} onChange={(event) => this.setState({first: event.target.value})} />
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='last'>Last Name</label>
            <input type='text' id='last' className='form-control' value={last} onChange={(event) => this.setState({last: event.target.value})} />
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='phone'>Phone Number</label>
            <input type='text' id='phone' className='form-control' value={phone} onChange={(event) => this.setState({phone: event.target.value})} />
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='street'>Street</label>
          <input type='text' id='street' className='form-control' value={street || ''} onChange={(event) => this.setState({street: event.target.value})} />
        </div>
        <div className='row'>
          <div className='form-group col-md-6'>
            <label htmlFor='city'>City</label>
            <input type='text' id='city' className='form-control' value={city || ''} onChange={(event) => this.setState({city: event.target.value})} />
          </div>
          <div className='form-group col-md-2'>
            <label htmlFor='state'>State</label>
            <input type='text' id='state' className='form-control' value={state || ''} onChange={(event) => this.setState({state: event.target.value})} />
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='zip'>Zip</label>
            <input type='text' id='zip' className='form-control' value={zip || ''} onChange={(event) => this.setState({zip: event.target.value})} />
          </div>
        </div>
        <div className='form-group'>
          <button type='submit' className='btn btn-success' disabled={busy}>
            Save
          </button>
        </div>
      </form>
      <hr />
      <h1>Billing</h1>
      <p>
        {stripeId
          ? <span>The card associated with your account is a {cardBrand} ending in {cardLast4}.</span>
          : <span>There is currently no card associated with your account.</span>
        }
      </p>
      <Billing busy={busy} user={currentUser} stripeKey={stripeKey} />
    </div>
  }
}
