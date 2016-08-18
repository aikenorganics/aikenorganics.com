import test from 'tape'
import freeze from 'deep-freeze'
import {ADD_PAYMENT} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('add payment', (t) => {
  const state = freeze({
    payments: [
      {id: 1, stripeId: '1'}
    ]
  })
  const next = reducer(state, {
    type: ADD_PAYMENT,
    values: {id: 2, stripeId: '2'}
  })
  t.deepEqual(next.payments, [
    {id: 1, stripeId: '1'},
    {id: 2, stripeId: '2'}
  ])
  t.end()
})
