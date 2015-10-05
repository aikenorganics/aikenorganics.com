let $ = require('jquery')
let json = require('../../json')
let React = require('react')

module.exports = class CartForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      quantity: this.props.quantity
    }
  }

  canIncrement () {
    return this.state.quantity < this.props.available
  }

  increment (e) {
    e.preventDefault()
    this.save(this.state.quantity + 1)
  }

  decrement (e) {
    e.preventDefault()
    this.save(this.state.quantity - 1)
  }

  submit (e) {
    e.preventDefault()
    e.stopPropagation()
    this.save(this.state.quantity)
  }

  save (quantity) {
    json('/cart', {
      method: 'post',
      body: {
        quantity: quantity,
        product_id: this.props.product_id
      }
    }).then((data) => {
      this.setState({quantity: data.quantity})
      // TODO: Do this better?
      $('#cart-size').text(data.cartSize)
    })
  }

  add () {
    return (
      <button type='submit' className='btn btn-primary'
        onClick={this.increment.bind(this)}>
        Add to Cart
      </button>
    )
  }

  update () {
    return (
      <div className='form-group'>
        <div className='input-group'>
          <div className='input-group-btn'>
            <button className='btn btn-primary'
              onClick={this.decrement.bind(this)}>
              -
            </button>
          </div>
          <span className='form-control'>{this.state.quantity}</span>
          <div className='input-group-btn'>
            <button className='btn btn-primary'
              disabled={!this.canIncrement()}
              onClick={this.increment.bind(this)}>
              +
            </button>
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <form className='form-inline' onSubmit={this.submit.bind(this)}>
        {this.state.quantity > 0 ? this.update() : this.add()}
      </form>
    )
  }

}
