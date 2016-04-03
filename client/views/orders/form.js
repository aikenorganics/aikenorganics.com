import React, {Component} from 'react'
import Link from '../link'
import {updateOrder} from '../../actions'

export default class Form extends Component {

  constructor (props) {
    super(props)
    const {location_id} = props.order
    this.state = {location_id}
  }

  save (e) {
    if (e) e.preventDefault()
    const {id} = this.props.order
    updateOrder(id, this.state).catch((e) => {})
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
    const {busy, locations} = this.props
    const {address} = this.props.user
    const {location_id} = this.state

    return <form onSubmit={(e) => this.save(e)}>
      <div className='form-group'>
        <label>Delivery</label>
        {this.canDeliver()
          ? <div className='checkbox'>
            <label>
              <input type='checkbox' value={location_id == null} onChange={(e) => this.toggleDelivery(e)}/>
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
        <button className='btn btn-primary' disabled={busy}>
          Update Order
        </button>
      </div>
    </form>
  }

}
