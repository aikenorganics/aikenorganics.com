import React, {PureComponent, PropTypes} from 'react'
import {createCategory, navigate, updateCategory} from '../../../actions'

export default class Form extends PureComponent {

  static propTypes () {
    return {
      category: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    const {meat, name, position} = props.category || {}
    this.state = {
      meat: !!meat,
      name: name || '',
      position: position || ''
    }
  }

  save (event) {
    event.preventDefault()
    if (this.props.category) {
      const {id} = this.props.category
      updateCategory(id, this.state).then(() => {
        navigate('/admin/categories')
      }).catch(() => {})
    } else {
      createCategory(this.state).then(() => {
        navigate('/admin/categories')
      }).catch(() => {})
    }
  }

  render () {
    const {meat, name, position} = this.state
    const {busy} = this.props

    return <form onSubmit={(event) => this.save(event)}>
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input autoFocus type='text' id='name' className='form-control' required value={name}
          onChange={(event) => this.setState({name: event.target.value})} disabled={busy} />
      </div>
      <div className='form-group'>
        <label htmlFor='position'>Position</label>
        <input type='number' id='position' className='form-control' required value={position}
          onChange={(event) => this.setState({position: event.target.value})} disabled={busy} />
      </div>
      <div className='form-check'>
        <label className='form-check-label'>
          <input className='form-check-input' type='checkbox' checked={meat}
            onChange={(event) => this.setState({meat: event.target.checked})} disabled={busy} />
          <span> Meat</span>
        </label>
      </div>
      <p className='text-xs-right'>
        <button type='submit' className='btn btn-success' disabled={busy}>
          Save
        </button>
      </p>
    </form>
  }
}
