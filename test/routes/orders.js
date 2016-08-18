'use strict'

const db = require('../../db')
const test = require('../test')

test('GET /orders/current is a 200', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .get('/orders/current')
    .expect(200)
    .end(t.end)
  })
})

test('GET /orders/current with no order', (t) => {
  t.signIn('finn@example.com').then(() => {
    t.agent
    .get('/orders/current')
    .expect(200)
    .end(t.end)
  })
})

test('DELETE /orders/:id is a 200', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .delete('/orders/2')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((e) => {
      if (e) return t.end(e)
      db.Order.find(2).then((order) => {
        t.ok(order == null, 'the order was deleted')
        t.end()
      }).catch(t.end)
    })
  })
})

test('POST /orders/:id is a 200', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .post('/orders/2')
    .send({
      locationId: 2,
      status: 'canceled',
      notes: 'updated'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end((e, res) => {
      if (e) return t.end(e)
      const {location, status, notes} = res.body.order
      t.ok(location)
      t.is(location.id, 2)
      t.is(status, 'open')
      t.is(notes, '')
      db.Order.find(2).then((order) => {
        t.is(order.locationId, 2)
        t.is(order.status, 'open')
        t.is(order.notes, '')
        t.end()
      }).catch(t.end)
    })
  })
})

test('Cannout update an order when the market is closed', (t) => {
  t.hostname('closed.localhost')
  t.signIn('user@example.com').then(() => {
    t.agent
    .post('/orders/2')
    .send({locationId: 2})
    .expect(401)
    .end(t.end)
  })
})

test('Cannot cancel someone else\'s order', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .delete('/orders/1')
    .set('Accept', 'application/json')
    .expect(401)
    .expect('Content-Type', /json/)
    .end(t.end)
  })
})

test('Cannout update someone else\'s order', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .post('/orders/1')
    .send({locationId: 2})
    .expect(401)
    .end(t.end)
  })
})

test('Admins can update someone else\'s order', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/orders/5')
    .send({
      locationId: 2,
      status: 'canceled',
      notes: 'updated'
    })
    .expect(200)
    .end((e, res) => {
      if (e) return t.end(e)
      const {location, notes, status} = res.body.order
      t.ok(location)
      t.is(location.id, 2)
      t.is(notes, 'updated')
      t.is(status, 'canceled')
      db.Order.find(5).then((order) => {
        t.is(order.locationId, 2)
        t.is(order.status, 'canceled')
        t.is(order.notes, 'updated')
        t.end()
      }).catch(t.end)
    })
  })
})

test('Admins can update orders when the market is closed', (t) => {
  t.hostname('closed.localhost')
  t.signIn('admin@example.com').then(() => {
    t.agent
    .post('/orders/5')
    .send({locationId: 2})
    .expect(200)
    .end(t.end)
  })
})

test('Canceling a missing order returns a 404', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .delete('/orders/123456789')
    .set('Accept', 'application/json')
    .expect(404)
    .expect('Content-Type', /json/)
    .end(t.end)
  })
})

test('Updating a missing order returns a 404', (t) => {
  t.signIn('user@example.com').then(() => {
    t.agent
    .post('/orders/123456789')
    .send({locationId: 2})
    .expect(404)
    .end(t.end)
  })
})

test('GET /orders/previous', (t) => {
  t.signIn('admin@example.com').then(() => {
    t.agent
    .get('/orders/previous')
    .expect(200)
    .end(t.end)
  })
})
