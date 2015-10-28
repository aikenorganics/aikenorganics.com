let React = require('react')

module.exports = class SubNav extends React.Component {

  cartSize () {
    return Object.keys(this.props.cart).reduce((total, id) => {
      return total + this.props.cart[id]
    }, 0)
  }

  open () {
    return <div className='alert alert-info'>
      <p>
        <strong>Hi!</strong> Aiken Organics is still under development,
        so please bear with us while we work out the kinks!
        If something goes wrong, or you have a question, or you just want to
        shoot the breeze, send an email to <a href='mailto:support@aikenorganics.com'>support@aikenorganics.com</a>.
      </p>
    </div>
  }

  closed () {
    return <div className='alert alert-warning text-center'>
      <p>
        <strong>The market is currently closed and will re-open on Sunday at 8:00AM. </strong>
        If you need help in the meantime, feel free to drop us a line
        at <a href='mailto:support@aikenorganics.com'>support@aikenorganics.com</a>.
      </p>
    </div>
  }

  cart () {
    if (!this.props.user || !this.props.open) return ''
    return <li>
      <a href='/cart'>
        Cart <span id='cart-size' className='badge'>{this.cartSize()}</span>
      </a>
    </li>
  }

  orders () {
    if (!this.props.user) return ''
    return <li>
      <a href='/orders/current'>
        Orders
      </a>
    </li>
  }

  render () {
    return <div className='hidden-print'>
      {this.props.open ? this.open() : this.closed()}
      <ul className='nav nav-tabs subnav'>
        <li>
          <a href='/products'>Products</a>
        </li>
        <li className='active'>
          <a href='/growers'>Growers</a>
        </li>
        {this.cart()}
        {this.orders()}
      </ul>
    </div>
  }

}
