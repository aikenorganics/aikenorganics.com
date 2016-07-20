import test from 'tape'
import freeze from 'deep-freeze'
import {CLEAR_MESSAGE, SET_MESSAGE} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

test('set message', (t) => {
  const state = freeze({message: {active: true, type: 'success', text: 'Done!'}})
  const next = reducer(state, {
    type: SET_MESSAGE,
    message: {active: false, type: 'danger', text: 'Whoops!'}
  })
  t.deepEqual(next.message, {active: false, type: 'danger', text: 'Whoops!'})
  t.end()
})

test('clear message', (t) => {
  const state = freeze({message: {active: true, type: 'success', text: 'Done!'}})
  const next = reducer(state, {type: CLEAR_MESSAGE})
  t.deepEqual(next.message, {active: false, type: 'success', text: 'Done!'})
  t.end()
})
