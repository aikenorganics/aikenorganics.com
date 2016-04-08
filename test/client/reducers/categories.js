import test from 'tape'
import freeze from 'deep-freeze'
import {
  REMOVE_CATEGORY,
  UPDATE_CATEGORY
} from '../../../client/actions/index'
import reducer from '../../../client/reducers/index'

test('update category - activate', (t) => {
  const state = freeze({
    categories: [
      {id: 1, name: 'foo'},
      {id: 2, name: 'bar'}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_CATEGORY,
    id: 2,
    values: {name: 'baz'}
  })
  t.deepEqual(next.categories, [
    {id: 1, name: 'foo'},
    {id: 2, name: 'baz'}
  ])
  t.end()
})

test('remove category', (t) => {
  const state = freeze({categories: [{id: 1}, {id: 2}]})
  const next = reducer(state, {type: REMOVE_CATEGORY, id: 2})
  t.deepEqual(next.categories, [{id: 1}])
  t.end()
})

test('no category to remove', (t) => {
  const state = freeze({})
  const next = reducer(state, {type: REMOVE_CATEGORY, id: 2})
  t.deepEqual(next.categories, null)
  t.end()
})
