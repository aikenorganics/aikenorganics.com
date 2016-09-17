import React, {PureComponent, PropTypes} from 'react'
import {updateCard} from '../../actions'

let stripe = null
const getStripe = () => stripe || (stripe = new Promise((resolve, reject) => {
  const script = document.createElement('script')
  script.src = 'https://checkout.stripe.com/checkout.js'
  script.async = true
  script.addEventListener('load', resolve)
  script.addEventListener('error', reject)
  document.head.appendChild(script)
}))

export default class Billing extends PureComponent {

  static propTypes () {
    return {
      busy: PropTypes.bool,
      user: PropTypes.object
    }
  }

  open () {
    const {user, stripeKey} = this.props
    getStripe().then(() => {
      window.StripeCheckout.configure({
        allowRememberMe: false,
        email: user.email,
        key: stripeKey,
        panelLabel: 'Save',
        token: (token) => updateCard(user.id, token.id)
      }).open({
        name: 'Aiken Organics',
        description: 'Billing Information'
      })
    }).catch(() => {})
  }

  render () {
    const {busy, user} = this.props

    return <button className='btn btn-success' onClick={() => this.open()} disabled={busy}>
      {user.stripeId ? 'Update Billing Info' : 'Enter Billing Info'}
    </button>
  }

}
