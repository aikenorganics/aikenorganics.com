import React, {Component} from 'react'
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

  render () {
    const {locations} = this.props
    const {location_id} = this.state

    return <form onSubmit={(e) => this.submit(e)}>
      <div className='form-group'>
        <label>Pickup Location</label>
        <select className='form-control' name='location_id' value={location_id}
          onChange={(e) => this.setState({location_id: e.target.value})}>
          {locations.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>
      </div>
      <div className='text-right'>
        <button type='submit' className='btn btn-primary'>
          Check Out
        </button>
      </div>
    </form>
  }
}
