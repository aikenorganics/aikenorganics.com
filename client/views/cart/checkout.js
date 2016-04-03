import React, {Component} from 'react'
import Link from '../link'
import {checkout, navigate} from '../../actions'

export default class Checkout extends Component {

  constructor (props) {
    super(props)
    const {locations, order} = props
    this.state = {
      location_id: order ? order.location_id : locations[0].id
    }
  }

  submit (e) {
    e.preventDefault()
    checkout(this.state).then(() => {
      navigate('/orders/current')
    }).catch((e) => {})
  }

  canDeliver () {
    const {phone, street, city, state, stripe_id, zip} = this.props.user
    return phone && street && city && state && stripe_id && zip
  }

  setLocation (e) {
    this.setState({location_id: e.target.value})
  }

  toggleDelivery (e) {
    const {locations} = this.props
    this.setState({location_id: e.target.checked ? null : locations[0].id})
  }

  render () {
    const {locations} = this.props
    const {address} = this.props.user
    const {location_id} = this.state

    return <form onSubmit={(e) => this.submit(e)}>
      <div className='form-group'>
        <label>Delivery</label>
        {this.canDeliver()
          ? <div className='checkbox'>
            <label>
              <input type='checkbox' checked={location_id == null} onChange={(e) => this.toggleDelivery(e)}/>
              Deliver to <strong>{address}</strong>
            </label>
          </div>
          : <div>
            <p>
              For delivery, please enter your address, phone number, and
              billing information. <Link href='/settings'>Edit Settings</Link>
            </p>
          </div>
        }
      </div>
      {location_id
        ? <div className='form-group'>
          <label>Pickup Location</label>
          <select className='form-control' value={location_id} onChange={(e) => this.setLocation(e)}>
            {locations.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
          </select>
        </div>
        : ''
      }
      <div className='text-right'>
        <button type='submit' className='btn btn-primary'>
          Check Out
        </button>
      </div>
    </form>
  }
}
