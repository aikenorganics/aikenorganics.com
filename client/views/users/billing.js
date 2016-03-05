import React, {Component, PropTypes} from 'react'
import {updateCard} from '../../actions'

let checkout = null
const getCheckout = () => {
  return checkout || (checkout = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.stripe.com/checkout.js'
    script.async = true
    script.addEventListener('load', () => resolve())
    document.head.appendChild(script)
  }))
}

export default class Billing extends Component {

  static propTypes () {
    return {
      busy: PropTypes.bool,
      user: PropTypes.object
    }
  }

  constructor (props) {
    super(props)
    this.state = {loaded: false}
  }

  open () {
    const {user} = this.props
    window.StripeCheckout.configure({
      allowRememberMe: false,
      email: user.email,
      key: JSON.parse(document.getElementById('stripe').innerHTML).key,
      panelLabel: 'Save',
      token: (token) => updateCard(user.id, token.id)
    }).open({
      name: 'Aiken Organics',
      description: 'Billing Information'
    })
  }

  render () {
    const {loaded} = this.state
    const {busy, user} = this.props

    if (!loaded) getCheckout().then(() => this.setState({loaded: true}))

    return <button className='btn btn-primary' onClick={(e) => this.open()} disabled={busy || !loaded}>
      {user.stripe_id ? 'Update Billing Info' : 'Enter Billing Info'}
    </button>
  }

}
