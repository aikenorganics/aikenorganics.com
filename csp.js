'use strict'

module.exports = function *(next) {
  this.csp('img-src', 'https://q.stripe.com')
  this.csp('frame-src', "https://checkout.stripe.com")
  this.csp('script-src', 'https://checkout.stripe.com')
  this.csp('connect-src', "https://checkout.stripe.com")
  yield next
}
