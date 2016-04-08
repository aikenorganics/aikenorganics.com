import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_MARKET} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

test('update location - activate', (t) => {
  const state = freeze({market: {message: 'foo'}})
  const next = reducer(state, {
    type: UPDATE_MARKET,
    values: {message: 'bar'}
  })
  t.deepEqual(next.market, {message: 'bar'})
  t.end()
})

test('update location - activate', (t) => {
  const state = freeze({market: null})
  const next = reducer(state, {
    type: UPDATE_MARKET,
    values: {message: 'bar'}
  })
  t.deepEqual(next.market, {message: 'bar'})
  t.end()
})
