import test from 'tape'
import freeze from 'deep-freeze'
import {SET_ERRORS} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

test('set errors', (t) => {
  const state = freeze({errors: null})
  const next = reducer(state, {
    type: SET_ERRORS,
    errors: {name: ['Name Error']}
  })
  t.deepEqual(next.errors, {name: ['Name Error']})
  t.end()
})

test('clear errors', (t) => {
  const state = freeze({errors: {name: ['Name Error']}})
  const next = reducer(state, {
    type: SET_ERRORS,
    errors: null
  })
  t.deepEqual(next.errors, null)
  t.end()
})
