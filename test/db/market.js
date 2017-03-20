'use strict'

const test = require('../test')
const Market = require('../../db/market')

test('closed when #closed is true, even in open period', async (assert) => {
  const market = new Market({
    openDay: 0,
    openHours: 8,
    openMinutes: 0,
    closeDay: 3,
    closeHours: 12,
    closeMinutes: 0
  })

  market.now = new Date('2017-02-12T14:00:00Z') // 9am, Sunday
  assert.ok(market.open)

  market.closed = true
  assert.ok(!market.open)
})

test('open Sunday to Wednesday', async (assert) => {
  const market = new Market({
    openDay: 0,
    openHours: 8,
    openMinutes: 0,
    closeDay: 3,
    closeHours: 12,
    closeMinutes: 0
  })

  market.now = new Date('2017-02-11T12:00:00Z') // 7am, Saturday
  assert.ok(!market.open)

  market.now = new Date('2017-02-12T12:00:00Z') // 7am, Sunday
  assert.ok(!market.open)

  market.now = new Date('2017-02-12T14:00:00Z') // 9am, Sunday
  assert.ok(market.open)

  market.now = new Date('2017-02-13T12:00:00Z') // 7am, Monday
  assert.ok(market.open)

  market.now = new Date('2017-02-14T12:00:00Z') // 7am, Tuesday
  assert.ok(market.open)

  market.now = new Date('2017-02-15T12:00:00Z') // 7am, Wednesday
  assert.ok(market.open)

  market.now = new Date('2017-02-15T18:00:00Z') // 1pm, Wednesday
  assert.ok(!market.open)

  market.now = new Date('2017-02-16T12:00:00Z') // 7am, Thursday
  assert.ok(!market.open)

  market.now = new Date('2017-02-17T12:00:00Z') // 7am, Friday
  assert.ok(!market.open)
})

test('open Friday to Monday', async (assert) => {
  const market = new Market({
    openDay: 5,
    openHours: 8,
    openMinutes: 0,
    closeDay: 1,
    closeHours: 12,
    closeMinutes: 0
  })

  market.now = new Date('2017-02-11T12:00:00Z') // 7am, Saturday
  assert.ok(market.open)

  market.now = new Date('2017-02-12T12:00:00Z') // 7am, Sunday
  assert.ok(market.open)

  market.now = new Date('2017-02-13T12:00:00Z') // 7am, Monday
  assert.ok(market.open)

  market.now = new Date('2017-02-14T12:00:00Z') // 7am, Tuesday
  assert.ok(!market.open)

  market.now = new Date('2017-02-15T12:00:00Z') // 7am, Wednesday
  assert.ok(!market.open)

  market.now = new Date('2017-02-16T12:00:00Z') // 7am, Thursday
  assert.ok(!market.open)

  market.now = new Date('2017-02-17T12:00:00Z') // 7am, Friday
  assert.ok(!market.open)
})

test('open Saturday only', async (assert) => {
  const market = new Market({
    openDay: 6,
    openHours: 8,
    openMinutes: 0,
    closeDay: 6,
    closeHours: 12,
    closeMinutes: 0
  })

  market.now = new Date('2017-02-11T12:00:00Z') // 7am, Saturday
  assert.ok(!market.open)

  market.now = new Date('2017-02-11T14:00:00Z') // 9am, Saturday
  assert.ok(market.open)

  market.now = new Date('2017-02-11T16:00:00Z') // 11am, Saturday
  assert.ok(market.open)

  market.now = new Date('2017-02-11T18:00:00Z') // 1pm, Saturday
  assert.ok(!market.open)

  market.now = new Date('2017-02-12T12:00:00Z') // 7am, Sunday
  assert.ok(!market.open)

  market.now = new Date('2017-02-13T12:00:00Z') // 7am, Monday
  assert.ok(!market.open)

  market.now = new Date('2017-02-14T12:00:00Z') // 7am, Tuesday
  assert.ok(!market.open)

  market.now = new Date('2017-02-15T12:00:00Z') // 7am, Wednesday
  assert.ok(!market.open)

  market.now = new Date('2017-02-16T12:00:00Z') // 7am, Thursday
  assert.ok(!market.open)

  market.now = new Date('2017-02-17T12:00:00Z') // 7am, Friday
  assert.ok(!market.open)
})
