import React, {PureComponent} from 'react'
import Link from '../link'
import {updateOrder} from '../../actions'

export default class Form extends PureComponent {

  constructor (props) {
    super(props)
    const {locationId} = props.order
    this.state = {locationId}
  }

  setLocation (event) {
    const {id} = this.props.order
    const locationId = +event.target.value || null
    this.setState({locationId})
    updateOrder(id, {locationId}).catch(() => {})
  }

  render () {
    const {busy, locations} = this.props
    const {address, canDeliver} = this.props.user
    const {locationId} = this.state

    return <div className='form-group'>
      <label>Pickup Location / Delivery</label>
      <select className='form-control' value={locationId || ''} onChange={(event) => this.setLocation(event)} disabled={busy}>
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
