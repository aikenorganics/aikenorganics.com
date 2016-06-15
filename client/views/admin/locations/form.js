import React, {Component, PropTypes} from 'react'
import {createLocation, navigate, updateLocation} from '../../../actions/index'

export default class Form extends Component {

  static propTypes () {
    return {
      location: PropTypes.object
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
        navigate('/admin/locations')
      }).catch((e) => {})
    } else {
      createLocation(this.state).then(() => {
        navigate('/admin/locations')
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
        <button type='submit' className='btn btn-success' disabled={busy}>
          Save
        </button>
      </p>
    </form>
  }

}

