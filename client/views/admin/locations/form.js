import React, {Component, PropTypes} from 'react'
import {createLocation, updateLocation} from '../../../actions'

export default class Form extends Component {

  static propTypes () {
    return {
      location: PropTypes.array
    }
  }

  constructor (props) {
    super(props)
    const {name} = props.location || {}
    this.state = {
      name: name || ''
    }
  }

  save (e) {
    e.preventDefault()
    if (this.props.location) {
      const {id} = this.props.location
      updateLocation(id, this.state).then(() => {
        window.location = '/admin/locations'
      }).catch((e) => {})
    } else {
      createLocation(this.state).then(() => {
        window.location = '/admin/locations'
      }).catch((e) => {})
    }
  }

  render () {
    const {name} = this.state
    const {busy} = this.props

    return <form onSubmit={(e) => this.save(e)}>
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input autoFocus type='text' id='name' className='form-control' required value={name}
        onChange={(e) => this.setState({name: e.target.value})} disabled={busy}/>
      </div>
      <p className='text-right'>
        <button type='submit' className='btn btn-primary' disabled={busy}>
          Save
        </button>
      </p>
    </form>
  }

}

