import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_USER} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update user - email', (assert) => {
  const state = freeze({
    users: [
      {id: 1, email: 'foo@example.com'},
      {id: 2, email: 'bar@example.com'}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_USER,
    id: 2,
    values: {email: 'user@example.com'}
  })
  assert.deepEqual(next.users, [
    {id: 1, email: 'foo@example.com'},
    {id: 2, email: 'user@example.com'}
  ])
  assert.end()
})
