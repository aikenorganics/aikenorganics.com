import test from 'tape'
import freeze from 'deep-freeze'
import {BUSY, DONE} from '../../../client/actions'
import reducer from '../../../client/reducers/index'

test('busy', (t) => {
  const state = freeze({busy: false})
  const next = reducer(state, {type: BUSY})
  t.is(next.busy, true)
  t.end()
})

test('done', (t) => {
  const state = freeze({busy: true})
  const next = reducer(state, {type: DONE})
  t.is(next.busy, false)
  t.end()
})
