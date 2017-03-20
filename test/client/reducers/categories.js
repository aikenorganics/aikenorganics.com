import test from 'tape'
import freeze from 'deep-freeze'
import {
  REMOVE_CATEGORY,
  UPDATE_CATEGORY
} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update category - activate', (assert) => {
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
  assert.deepEqual(next.categories, [
    {id: 1, name: 'foo'},
    {id: 2, name: 'baz'}
  ])
  assert.end()
})

test('remove category', (assert) => {
  const state = freeze({categories: [{id: 1}, {id: 2}]})
  const next = reducer(state, {type: REMOVE_CATEGORY, id: 2})
  assert.deepEqual(next.categories, [{id: 1}])
  assert.end()
})

test('no category to remove', (assert) => {
  const state = freeze({})
  const next = reducer(state, {type: REMOVE_CATEGORY, id: 2})
  assert.deepEqual(next.categories, null)
  assert.end()
})
