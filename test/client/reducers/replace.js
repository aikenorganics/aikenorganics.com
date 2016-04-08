import test from 'tape'
import freeze from 'deep-freeze'
import {REPLACE} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

test('replace state', (t) => {
  const state = freeze({
    busy: true,
    category_id: 7,
    user: {id: 1, email: 'finn@ooo.net'}
  })
  const next = reducer(state, {
    type: REPLACE,
    state: {
      busy: false,
      user: {id: 7, email: 'jake@ooo.net'}
    }
  })
  t.is(next.category_id, null)
  t.is(next.busy, false)
  t.deepEqual(next.user, {id: 7, email: 'jake@ooo.net'})
  t.end()
})
