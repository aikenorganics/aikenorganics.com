import test from 'tape'
import freeze from 'deep-freeze'
import {REPLACE} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('replace state', (t) => {
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
  t.is(next.categoryId, null)
  t.is(next.busy, false)
  t.deepEqual(next.user, {id: 7, email: 'jake@ooo.net'})
  t.end()
})
