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

  submit (e) {
    e.preventDefault()
    if (this.props.busy) return
    checkout(this.state).then(() => {
      navigate('/orders/current')
    }).catch((e) => {})
  }

  setLocation (e) {
    this.setState({locationId: +e.target.value || null})
  }

  render () {
    const {busy, locations} = this.props
    const {address, canDeliver} = this.props.user
    const {locationId} = this.state

    return <form onSubmit={(e) => this.submit(e)}>
      <div className='form-group'>
        <label>Pickup Location / Delivery</label>
        <select className='form-control' value={locationId || ''} onChange={(e) => this.setLocation(e)}>
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
        <button type='submit' className='btn btn-success' disabled={busy}>
          Check Out
        </button>
      </div>
    </form>
  }
}
