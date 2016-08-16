import test from 'tape'
import freeze from 'deep-freeze'
import {UPDATE_GROWER} from '../../../client/actions'
import reducer from '../../../client/reducers'

test('update grower', (t) => {
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
  t.deepEqual(next.growers, [
    {id: 1, active: false},
    {id: 2, active: true}
  ])
  t.end()
})
