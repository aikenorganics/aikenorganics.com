import React, {Component} from 'react'
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

  render () {
    const {locations} = this.props
    const {location_id} = this.state

    return <form onSubmit={(e) => this.save(e)}>
      <div className='form-group'>
        <label>Pickup Location</label>
        <select className='form-control' value={location_id}
          onChange={(e) => this.setState({location_id: e.target.value})}>
          {locations.map(({id, name}) => {
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
      </div>
      <div className='text-right'>
        <button className='btn btn-primary'>
          Update Order
        </button>
      </div>
    </form>
  }

}
