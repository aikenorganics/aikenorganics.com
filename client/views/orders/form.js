import React, {Component} from 'react'
import Link from '../link'
import {updateOrder} from '../../actions/index'

export default class Form extends Component {

  constructor (props) {
    super(props)
    const {location_id} = props.order
    this.state = {location_id}
  }

  save (e) {
    if (e) e.preventDefault()
    const {busy, order} = this.props
    if (busy) return
    updateOrder(order.id, this.state).catch((e) => {})
  }

  setLocation (e) {
    this.setState({location_id: +e.target.value || null})
  }

  render () {
    const {busy, locations} = this.props
    const {address, canDeliver} = this.props.user
    const {location_id} = this.state

    return <form onSubmit={(e) => this.save(e)}>
      <div className='form-group'>
        <label>Pickup Location / Delivery</label>
        <select className='form-control' value={location_id || ''} onChange={(e) => this.setLocation(e)}>
          <option value='0' disabled={!canDeliver}>
            {canDeliver
              ? `Deliver to ${address}`
              : 'Delivery - Please update your settings first.'
            }
          </option>
          {locations.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>
        {!canDeliver
          ? <p className='help-block'>
            For delivery, please enter your address, phone number, and
            billing information. <Link href='/settings'>Edit Settings</Link>
          </p>
          : ''
        }
      </div>
      <div className='text-right'>
        <button className='btn btn-success' disabled={busy}>
          Update Order
        </button>
      </div>
    </form>
  }

}
