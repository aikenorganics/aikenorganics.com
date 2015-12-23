import React from 'react'
import json from '../../json'
import message from '../../message'

export default class ProductRow extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      pending: false,
      supply: this.props.product.supply,
      active: this.props.product.active
    }
  }

  handleChange (e) {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => { this.saveSupply() }, 2000)
    this.setState({
      pending: true,
      supply: e.target.value
    })
  }

  handleBlur (e) {
    this.saveSupply()
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) this.saveSupply()
  }

  saveSupply () {
    if (this.timer) clearTimeout(this.timer)
    if (!this.state.pending) return
    this.setState({pending: false})
    this.save({supply: this.state.supply || 0})
  }

  toggleActive (active) {
    this.setState({active})
    this.save({active})
  }

  save (values) {
    message('info', 'Saving…')
    json(`/products/${this.props.product.id}`, {
      method: 'POST',
      body: values
    }).then(() => { message('success', 'Saved.') })
  }

  render () {
    return <tr>
      <td>
        <a href={`/products/${this.props.product.id}`}>
          {this.props.product.name}
        </a>
      </td>
      <td>
        <input className='form-control' type='number' value={this.state.supply}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
        />
      </td>
      <td>
        <div className='btn-group'>
          <button type='button'
            className={`btn ${this.state.active ? 'btn-primary' : 'btn-default'}`}
            onClick={this.toggleActive.bind(this, true)}>
            Active
          </button>
          <button type='button'
            className={`btn ${this.state.active ? 'btn-default' : 'btn-danger'}`}
            onClick={this.toggleActive.bind(this, false)}>
            Inactive
          </button>
        </div>
      </td>
    </tr>
  }

}

