import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_GROWER} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update grower', (assert) => {
  const state = freeze({
    growers: [
      {id: 1, active: false},
      {id: 2, active: false}
    ]
  })
  const next = reducer(state, {
    type: UPDATE_GROWER,
    id: 2,
    values: {active: true}
  })
  assert.deepEqual(next.growers, [
    {id: 1, active: false},
    {id: 2, active: true}
  ])
  assert.end()
})
