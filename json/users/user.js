'use strict'

module.exports = (set, user) => {
  set(user,
    'id',
    'canDeliver',
    'email',
    'name',
    'last',
    'first',
    'phone',
    'isAdmin',
    'memberUntil',
    'stripeId',
    'cardBrand',
    'cardLast4',
    'street',
    'city',
    'state',
    'zip',
    'address',
    'has_order',
    'mediumImage'
  )
}
