'use strict'

module.exports = (set, payment) => {
  set(payment,
    'id',
    'stripe_id',
    'order_id',
    'amount'
  )
}
