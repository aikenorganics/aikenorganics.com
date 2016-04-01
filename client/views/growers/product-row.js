import React, {Component, PropTypes} from 'react'
import Link from '../link'
import {updateProduct} from '../../actions'

export default class ProductRow extends Component {

  static propTypes () {
    return {
      busy: PropTypes.bool,
      product: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      pending: false,
      supply: props.product.supply
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

  handleBlur () {
    this.saveSupply()
  }

  handleKeyDown (e) {
    if (e.which === 13) this.saveSupply()
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
    updateProduct(this.props.product.id, values).catch((e) => {})
  }

  render () {
    const {busy, product: {id, active, name}} = this.props

    return <tr>
      <td>
        <Link href={`/products/${id}`}>
          {name}
        </Link>
      </td>
      <td>
        <input className='form-control' type='number' value={this.state.supply}
          onChange={(e) => this.handleChange(e)}
          onBlur={() => this.handleBlur()}
          onKeyDown={(e) => this.handleKeyDown(e)}
        />
      </td>
      <td>
        <div className='btn-group'>
          <button type='button' disabled={busy}
            className={`btn ${active ? 'btn-primary' : 'btn-default'}`}
            onClick={() => this.toggleActive(true)}>
            Active
          </button>
          <button type='button' disabled={busy}
            className={`btn ${active ? 'btn-default' : 'btn-danger'}`}
            onClick={() => this.toggleActive(false)}>
            Inactive
          </button>
        </div>
      </td>
    </tr>
  }

}
