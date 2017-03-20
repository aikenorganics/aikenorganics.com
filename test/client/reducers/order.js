import test from 'tape'
import freeze from 'deep-freeze'
import {
  CANCEL_ORDER,
  UPDATE_ORDER
} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update order - locationId', (assert) => {
  const state = freeze({order: {id: 1, locationId: 1}})
  const next = reducer(state, {
    type: UPDATE_ORDER,
    id: 1,
    values: {locationId: 2}
  })
  assert.deepEqual(next.order, {id: 1, locationId: 2})
  assert.end()
})

test('update order - wrong id', (assert) => {
  const state = freeze({order: {id: 1, locationId: 1}})
  const next = reducer(state, {
    type: UPDATE_ORDER,
    id: 2,
    values: {locationId: 2}
  })
  assert.deepEqual(next.order, {id: 1, locationId: 1})
  assert.end()
})

test('update order - remove location', (assert) => {
  const state = freeze({order: {id: 1, locationId: 1, location: {}}})
  const next = reducer(state, {
    type: UPDATE_ORDER,
    id: 1,
    values: {locationId: null}
  })
  assert.deepEqual(next.order, {id: 1, locationId: null})
  assert.end()
})

test('cancel order - already null', (assert) => {
  const state = freeze({order: null})
  const next = reducer(state, {
    type: CANCEL_ORDER,
    id: 3
  })
  assert.is(next.order, null)
  assert.end()
})

test('cancel order', (assert) => {
  const state = freeze({order: {id: 3}})
  const next = reducer(state, {
    type: CANCEL_ORDER,
    id: 3
  })
  assert.is(next.order, null)
  assert.end()
})

test('cancel order - wrong id', (assert) => {
  const state = freeze({order: {id: 3}})
  const next = reducer(state, {
    type: CANCEL_ORDER,
    id: 2
  })
  assert.deepEqual(next.order, {id: 3})
  assert.end()
})
