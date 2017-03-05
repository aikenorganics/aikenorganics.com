import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_USER} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update currentUser - email', (t) => {
  const state = freeze({currentUser: {id: 1, email: 'foo@example.com'}})
  const next = reducer(state, {
    type: UPDATE_USER,
    id: 1,
    values: {email: 'bar@example.com'}
  })
  t.deepEqual(next.currentUser, {id: 1, email: 'bar@example.com'})
  t.end()
})

test('update currentUser - wrong id', (t) => {
  const state = freeze({currentUser: {id: 1, email: 'foo@example.com'}})
  const next = reducer(state, {
    type: UPDATE_USER,
    id: 2,
    values: {email: 'bar@example.com'}
  })
  t.deepEqual(next.currentUser, {id: 1, email: 'foo@example.com'})
  t.end()
})
