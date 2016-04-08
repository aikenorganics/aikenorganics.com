import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_PRODUCT} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

test('update product - activate', (t) => {
  const state = freeze({
    products: [
      {id: 1, active: false},
      {id: 2, active: false}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_PRODUCT,
    id: 2,
    values: {active: true}
  })
  t.deepEqual(next.products, [
    {id: 1, active: false},
    {id: 2, active: true}
  ])
  t.end()
})

test('update product - deactivate', (t) => {
  const state = freeze({
    products: [
      {id: 1, active: true},
      {id: 2, active: true}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_PRODUCT,
    id: 2,
    values: {active: false}
  })
  t.deepEqual(next.products, [
    {id: 1, active: true},
    {id: 2, active: false}
  ])
  t.end()
})
