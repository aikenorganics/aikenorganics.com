import React, {PureComponent} from 'react'
import Link from '../link'
import {checkout, navigate} from '../../actions'

export default class Checkout extends PureComponent {

  constructor (props) {
    super(props)
    const {locations, order} = props
    this.state = {
      locationId: order ? order.locationId : locations[0].id
    }
  }

  submit (event) {
    event.preventDefault()
    if (this.props.busy) return
    checkout(this.state).then(() => {
      navigate('/orders/current')
    }).catch(() => {})
  }

  setLocation (event) {
    this.setState({locationId: +event.target.value || null})
  }

  render () {
    const {busy, locations} = this.props
    const {address, canDeliver} = this.props.user
    const {locationId} = this.state

    return <form onSubmit={(event) => this.submit(event)}>
      <div className='form-group'>
        <label>Pickup Location / Delivery</label>
        <select className='form-control' value={locationId || ''} onChange={(event) => this.setLocation(event)}>
          <option value='0' disabled={!canDeliver}>
            {canDeliver
              ? `Deliver to ${address}`
              : 'Delivery - Please update your settings first.'
            }
          </option>
          {locations.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>
        {!canDeliver
          ? <small className='form-text text-muted'>
            For delivery, please enter your address, phone number, and
            billing information. <Link href='/settings'>Edit Settings</Link>
          </small>
          : ''
        }
      </div>
      <div className='text-xs-right'>
        <button type='submit' className='btn btn-success' disabled={busy}>
          Check Out
        </button>
      </div>
    </form>
  }
}
