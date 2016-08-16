import test from 'tape'
import freeze from 'deep-freeze'
import {ADD_PAYMENT} from '../../../client/actions'
import reducer from '../../../client/reducers/index'

test('add payment', (t) => {
  const state = freeze({
    payments: [
      {id: 1, stripe_id: '1'}
    ]
  })
  const next = reducer(state, {
    type: ADD_PAYMENT,
    values: {id: 2, stripe_id: '2'}
  })
  t.deepEqual(next.payments, [
    {id: 1, stripe_id: '1'},
    {id: 2, stripe_id: '2'}
  ])
  t.end()
})
