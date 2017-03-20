import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_MARKET} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update location - activate', (assert) => {
  const state = freeze({market: {message: 'foo'}})
  const next = reducer(state, {
    type: UPDATE_MARKET,
    values: {message: 'bar'}
  })
  assert.deepEqual(next.market, {message: 'bar'})
  assert.end()
})

test('update location - activate', (assert) => {
  const state = freeze({market: null})
  const next = reducer(state, {
    type: UPDATE_MARKET,
    values: {message: 'bar'}
  })
  assert.deepEqual(next.market, {message: 'bar'})
  assert.end()
})
