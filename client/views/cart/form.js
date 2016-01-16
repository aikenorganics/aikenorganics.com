import React, {Component, PropTypes} from 'react'
import {updateCart} from '../../actions'

export default class CartForm extends Component {

  static propTypes () {
    return {
      cart: PropTypes.object,
      product: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    this.state = {working: false}
  }

  get quantity () {
    const {product: {id}, cart} = this.props
    return cart[id] || 0
  }

  canIncrement () {
    const {product: {available}} = this.props
    return this.quantity < available
  }

  increment (e) {
    this.save(this.quantity + 1)
  }

  decrement (e) {
    this.save(this.quantity - 1)
  }

  save (quantity) {
    const {product: {id}} = this.props
    this.setState({working: true})
    updateCart(id, quantity)
    .then(() => this.setState({working: false}))
    .catch(() => this.setState({working: false}))
  }

  render () {
    const {working} = this.state

    return <span className='form-inline'>
      {this.quantity > 0
        ? <span className='form-group'>
          <span className='input-group'>
            <span className='input-group-btn'>
              <button type='button' className='btn btn-primary'
                disabled={working}
                onClick={() => this.decrement()}>
                -
              </button>
            </span>
            <span className='form-control'>{this.quantity}</span>
            <span className='input-group-btn'>
              <button type='button' className='btn btn-primary'
                disabled={working || !this.canIncrement()}
                onClick={() => this.increment()}>
                +
              </button>
            </span>
          </span>
        </span>
        : <button type='button' className='btn btn-primary'
            disabled={working}
            onClick={() => this.increment()}>
          Add to Cart
        </button>
      }
    </span>
  }

}
