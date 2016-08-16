import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_USER} from '../../../client/actions'
import reducer from '../../../client/reducers/index'

test('update user - email', (t) => {
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
  t.deepEqual(next.users, [
    {id: 1, email: 'foo@example.com'},
    {id: 2, email: 'user@example.com'}
  ])
  t.end()
})
