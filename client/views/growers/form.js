import React, {PureComponent, PropTypes} from 'react'
import {createGrower, navigate, updateGrower} from '../../actions'
import Errors from '../errors'

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

  save (event) {
    event.preventDefault()
    if (this.props.grower) {
      const {id} = this.props.grower
      updateGrower(id, this.state).catch(() => {})
    } else {
      createGrower(this.state).then(({grower: {id}}) => {
        navigate(`/growers/${id}`)
      }).catch(() => {})
    }
  }

  render () {
    const {errors} = this.props
    const {description, email, location, name, url} = this.state
    return <form onSubmit={(event) => this.save(event)}>
      <Errors errors={errors} />
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input autoFocus type='text' id='name' className='form-control' required value={name || ''} onChange={(event) => this.setState({name: event.target.value})} />
      </div>
      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input type='text' id='email' className='form-control' value={email || ''} onChange={(event) => this.setState({email: event.target.value})} />
      </div>
      <div className='form-group'>
        <label htmlFor='url'>Url</label>
        <input type='text' id='url' className='form-control' value={url || ''} onChange={(event) => this.setState({url: event.target.value})} />
      </div>
      <div className='form-group'>
        <label htmlFor='location'>Location</label>
        <input type='text' id='location' className='form-control' value={location || ''} onChange={(event) => this.setState({location: event.target.value})} />
      </div>
      <div className='form-group'>
        <label htmlFor='description'>Description</label>
        <textarea rows='5' id='description' className='form-control' value={description || ''} onChange={(event) => this.setState({description: event.target.value})} />
      </div>
      <p className='text-xs-right'>
        <button type='submit' className='btn btn-success'>
          Save
        </button>
      </p>
    </form>
  }
}
