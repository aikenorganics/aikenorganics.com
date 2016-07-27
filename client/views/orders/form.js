import React, {Component} from 'react'
import Link from '../link'
import {updateOrder} from '../../actions/index'

export default class Form extends Component {

  constructor (props) {
    super(props)
    const {location_id} = props.order
    this.state = {location_id}
  }

  setLocation (e) {
    const {id} = this.props.order
    const location_id = +e.target.value || null
    this.setState({location_id})
    updateOrder(id, {location_id}).catch((e) => {})
  }

  render () {
    const {busy, locations} = this.props
    const {address, canDeliver} = this.props.user
    const {location_id} = this.state

    return <div className='form-group'>
      <label>Pickup Location / Delivery</label>
      <select className='form-control' value={location_id || ''} onChange={(e) => this.setLocation(e)} disabled={busy}>
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
  }

}
