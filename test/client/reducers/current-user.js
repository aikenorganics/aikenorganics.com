import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_USER} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update currentUser - email', (assert) => {
  const state = freeze({currentUser: {id: 1, email: 'foo@example.com'}})
  const next = reducer(state, {
    type: UPDATE_USER,
    id: 1,
    values: {email: 'bar@example.com'}
  })
  assert.deepEqual(next.currentUser, {id: 1, email: 'bar@example.com'})
  assert.end()
})

test('update currentUser - wrong id', (assert) => {
  const state = freeze({currentUser: {id: 1, email: 'foo@example.com'}})
  const next = reducer(state, {
    type: UPDATE_USER,
    id: 2,
    values: {email: 'bar@example.com'}
  })
  assert.deepEqual(next.currentUser, {id: 1, email: 'foo@example.com'})
  assert.end()
})
