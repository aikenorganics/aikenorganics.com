import React, {PureComponent, PropTypes} from 'react'
import {createLocation, navigate, updateLocation} from '../../../actions'

export default class Form extends PureComponent {

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

  save (event) {
    event.preventDefault()
    if (this.props.location) {
      const {id} = this.props.location
      updateLocation(id, this.state).then(() => {
        navigate('/admin/locations')
      }).catch(() => {})
    } else {
      createLocation(this.state).then(() => {
        navigate('/admin/locations')
      }).catch(() => {})
    }
  }

  render () {
    const {name} = this.state
    const {busy} = this.props

    return <form onSubmit={(event) => this.save(event)}>
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input autoFocus type='text' id='name' className='form-control' required value={name}
          onChange={(event) => this.setState({name: event.target.value})} disabled={busy} />
      </div>
      <p className='text-xs-right'>
        <button type='submit' className='btn btn-success' disabled={busy}>
          Save
        </button>
      </p>
    </form>
  }

}

