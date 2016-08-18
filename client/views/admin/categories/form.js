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

  save (e) {
    e.preventDefault()
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

    return <form onSubmit={(e) => this.save(e)}>
      <div className='form-group'>
        <label htmlFor='name'>Name</label>
        <input autoFocus type='text' id='name' className='form-control' required value={name}
          onChange={(e) => this.setState({name: e.target.value})} disabled={busy} />
      </div>
      <div className='form-group'>
        <label htmlFor='position'>Position</label>
        <input type='number' id='position' className='form-control' required value={position}
          onChange={(e) => this.setState({position: e.target.value})} disabled={busy} />
      </div>
      <div className='form-group'>
        <label>
          <input type='checkbox' checked={meat}
            onChange={(e) => this.setState({meat: e.target.checked})} disabled={busy} />
          <span> Meat</span>
        </label>
      </div>
      <p className='text-right'>
        <button type='submit' className='btn btn-success' disabled={busy}>
          Save
        </button>
      </p>
    </form>
  }
}
