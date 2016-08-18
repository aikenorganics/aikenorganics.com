'use strict'

module.exports = (set, payment) => {
  set(payment,
    'id',
    'stripeId',
    'orderId',
    'amount'
  )
}
