import React, {PureComponent, PropTypes} from 'react'
import {createGrower, navigate, updateGrower} from '../../actions'

export default class Form extends PureComponent {

  static get propTypes () {
    return {
      busy: PropTypes.bool,
      errors: PropTypes.object,
      grower: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    const {description, email, location, name, url} = props.grower || {}
    this.state = {description, email, location, name, url}
  }

  save (e) {
    e.preventDefault()
    if (this.props.grower) {
      const {id} = this.props.grower
      updateGrower(id, this.state).catch((e) => {})
    } else {
      createGrower(this.state).then(({grower: {id}}) => {
        navigate(`/growers/${id}`)
      }).catch((e) => {})
    }
  }

  render () {
    const {description, email, location, name, url} = this.state
    return <form onSubmit={(e) => this.save(e)}>
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input autoFocus type='text' id='name' className='form-control' required value={name || ''} onChange={(e) => this.setState({name: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input type='text' id='email' className='form-control' value={email || ''} onChange={(e) => this.setState({email: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='url'>Url</label>
        <input type='text' id='url' className='form-control' value={url || ''} onChange={(e) => this.setState({url: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='location'>Location</label>
        <input type='text' id='location' className='form-control' value={location || ''} onChange={(e) => this.setState({location: e.target.value})}/>
      </div>
      <div className='form-group'>
        <label htmlFor='description'>Description</label>
        <textarea rows='5' id='description' className='form-control' value={description || ''} onChange={(e) => this.setState({description: e.target.value})}/>
      </div>
      <p className='text-right'>
        <button type='submit' className='btn btn-success'>
          Save
        </button>
      </p>
    </form>
  }
}
