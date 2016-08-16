import test from 'tape'
import freeze from 'deep-freeze'
import {
  CANCEL_ORDER,
  UPDATE_ORDER
} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update order - location_id', (t) => {
  const state = freeze({order: {id: 1, location_id: 1}})
  const next = reducer(state, {
    type: UPDATE_ORDER,
    id: 1,
    values: {location_id: 2}
  })
  t.deepEqual(next.order, {id: 1, location_id: 2})
  t.end()
})

test('update order - wrong id', (t) => {
  const state = freeze({order: {id: 1, location_id: 1}})
  const next = reducer(state, {
    type: UPDATE_ORDER,
    id: 2,
    values: {location_id: 2}
  })
  t.deepEqual(next.order, {id: 1, location_id: 1})
  t.end()
})

test('update order - remove location', (t) => {
  const state = freeze({order: {id: 1, location_id: 1, location: {}}})
  const next = reducer(state, {
    type: UPDATE_ORDER,
    id: 1,
    values: {location_id: null}
  })
  t.deepEqual(next.order, {id: 1, location_id: null})
  t.end()
})

test('cancel order - already null', (t) => {
  const state = freeze({order: null})
  const next = reducer(state, {
    type: CANCEL_ORDER,
    id: 3
  })
  t.is(next.order, null)
  t.end()
})

test('cancel order', (t) => {
  const state = freeze({order: {id: 3}})
  const next = reducer(state, {
    type: CANCEL_ORDER,
    id: 3
  })
  t.is(next.order, null)
  t.end()
})

test('cancel order - wrong id', (t) => {
  const state = freeze({order: {id: 3}})
  const next = reducer(state, {
    type: CANCEL_ORDER,
    id: 2
  })
  t.deepEqual(next.order, {id: 3})
  t.end()
})
