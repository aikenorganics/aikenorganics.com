import React, {Component} from 'react'
import {createLocation} from '../../../actions'

export default class New extends Component {

  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  changeName (e) {
    this.setState({name: e.target.value})
  }

  submit (e) {
    e.preventDefault()
    createLocation({name: this.state.name}).then(() => {
      window.location = '/admin/locations'
    })
  }

  render () {
    const {name} = this.state

    return <div>
      <h1>New Location</h1>
      <form onSubmit={(e) => this.submit(e)}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input autoFocus type='text' id='name' name='name' className='form-control' required value={name} onChange={(e) => this.changeName(e)}/>
        </div>
        <p className='text-right'>
          <button type='submit' className='btn btn-primary'>
            Save
          </button>
        </p>
      </form>
    </div>
  }

}
