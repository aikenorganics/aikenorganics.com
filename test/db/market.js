'use strict'

const test = require('../test')
const Market = require('../../db/market')

test('open Sunday to Wednesday', async (t) => {
  const market = new Market({
    openDay: 0,
    openHours: 8,
    openMinutes: 0,
    closeDay: 3,
    closeHours: 12,
    closeMinutes: 0
  })

  t.ok(!market.isOpenAt(new Date('2017-02-11T12:00:00Z'))) // 7am, Saturday
  t.ok(!market.isOpenAt(new Date('2017-02-12T12:00:00Z'))) // 7am, Sunday
  t.ok(market.isOpenAt(new Date('2017-02-12T14:00:00Z'))) // 9am, Sunday
  t.ok(market.isOpenAt(new Date('2017-02-13T12:00:00Z'))) // 7am, Monday
  t.ok(market.isOpenAt(new Date('2017-02-14T12:00:00Z'))) // 7am, Tuesday
  t.ok(market.isOpenAt(new Date('2017-02-15T12:00:00Z'))) // 7am, Wednesday
  t.ok(!market.isOpenAt(new Date('2017-02-15T18:00:00Z'))) // 1pm, Wednesday
  t.ok(!market.isOpenAt(new Date('2017-02-16T12:00:00Z'))) // 7am, Thursday
  t.ok(!market.isOpenAt(new Date('2017-02-17T12:00:00Z'))) // 7am, Friday
})

test('open Friday to Monday', async (t) => {
  const market = new Market({
    openDay: 5,
    openHours: 8,
    openMinutes: 0,
    closeDay: 1,
    closeHours: 12,
    closeMinutes: 0
  })
  t.ok(market.isOpenAt(new Date('2017-02-11T12:00:00Z'))) // 7am, Saturday
  t.ok(market.isOpenAt(new Date('2017-02-12T12:00:00Z'))) // 7am, Sunday
  t.ok(market.isOpenAt(new Date('2017-02-13T12:00:00Z'))) // 7am, Monday
  t.ok(!market.isOpenAt(new Date('2017-02-14T12:00:00Z'))) // 7am, Tuesday
  t.ok(!market.isOpenAt(new Date('2017-02-15T12:00:00Z'))) // 7am, Wednesday
  t.ok(!market.isOpenAt(new Date('2017-02-16T12:00:00Z'))) // 7am, Thursday
  t.ok(!market.isOpenAt(new Date('2017-02-17T12:00:00Z'))) // 7am, Friday
})

test('open Saturday only', async (t) => {
  const market = new Market({
    openDay: 6,
    openHours: 8,
    openMinutes: 0,
    closeDay: 6,
    closeHours: 12,
    closeMinutes: 0
  })
  t.ok(!market.isOpenAt(new Date('2017-02-11T12:00:00Z'))) // 7am, Saturday
  t.ok(market.isOpenAt(new Date('2017-02-11T14:00:00Z'))) // 9am, Saturday
  t.ok(market.isOpenAt(new Date('2017-02-11T16:00:00Z'))) // 11am, Saturday
  t.ok(!market.isOpenAt(new Date('2017-02-11T18:00:00Z'))) // 1pm, Saturday
  t.ok(!market.isOpenAt(new Date('2017-02-12T12:00:00Z'))) // 7am, Sunday
  t.ok(!market.isOpenAt(new Date('2017-02-13T12:00:00Z'))) // 7am, Monday
  t.ok(!market.isOpenAt(new Date('2017-02-14T12:00:00Z'))) // 7am, Tuesday
  t.ok(!market.isOpenAt(new Date('2017-02-15T12:00:00Z'))) // 7am, Wednesday
  t.ok(!market.isOpenAt(new Date('2017-02-16T12:00:00Z'))) // 7am, Thursday
  t.ok(!market.isOpenAt(new Date('2017-02-17T12:00:00Z'))) // 7am, Friday
})
