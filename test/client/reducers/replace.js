import test from 'tape'
import freeze from 'deep-freeze'
import {REPLACE} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('replace state', (assert) => {
  const state = freeze({
    busy: true,
    categoryId: 7,
    user: {id: 1, email: 'finn@ooo.net'}
  })
  const next = reducer(state, {
    type: REPLACE,
    state: {
      busy: false,
      user: {id: 7, email: 'jake@ooo.net'}
    }
  })
  assert.is(next.categoryId, null)
  assert.is(next.busy, false)
  assert.deepEqual(next.user, {id: 7, email: 'jake@ooo.net'})
  assert.end()
})
