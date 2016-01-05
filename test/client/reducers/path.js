import test from 'tape'
import freeze from 'deep-freeze'
import reducer from '../../../client/reducers'
import {CHANGE_PATH} from '../../../client/actions'

test('change path', (t) => {
  const state = freeze({path: null})
  const next = reducer(state, {
    type: CHANGE_PATH,
    path: '/path',
    Component: {}
  })
  t.is(next.path, '/path')
  t.end()
})
