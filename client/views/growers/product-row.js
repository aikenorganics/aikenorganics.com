import React from 'react'
import {updateProduct} from '../../actions'

export default class ProductRow extends React.Component {

  static propTypes () {
    return {
      product: React.PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      pending: false,
      supply: this.props.product.supply
    }
  }

  handleChange (e) {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(() => this.saveSupply(), 2000)
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
    this.save({active})
  }

  save (values) {
    updateProduct(this.props.product.id, values)
  }

  render () {
    const {id, active, name} = this.props.product

    return <tr>
      <td>
        <a href={`/products/${id}`}>
          {name}
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
            className={`btn ${active ? 'btn-primary' : 'btn-default'}`}
            onClick={this.toggleActive.bind(this, true)}>
            Active
          </button>
          <button type='button'
            className={`btn ${active ? 'btn-default' : 'btn-danger'}`}
            onClick={this.toggleActive.bind(this, false)}>
            Inactive
          </button>
        </div>
      </td>
    </tr>
  }

}
