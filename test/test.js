'use strict'

const db = require('../db')
const app = require('../app')
const tape = require('tape')
const request = require('supertest')
const query = db.query

app.post('/signin', (req, res) => {
  db.User.where({email: req.body.email}).find().then((user) => {
    req.signIn(user)
    res.end()
  }).catch(res.error)
})

// Export a function with the tape API.
exports = module.exports = (name, callback) => {
  tape(name, (t) => {
    // Set up transactions.
    const transaction = db.transaction()
    db.query = transaction.query.bind(transaction)

    // Set a fake hostname
    app.set('hostname', 'open.localhost')
    t.hostname = (hostname) => app.set('hostname', hostname)

    // Request without the app requirement.
    t.request = () => request(app)

    // Convenient agent reference.
    t.agent = request.agent(app)

    // Sign in, with error handling.
    t.signIn = (email) => {
      return new Promise((resolve, reject) => {
        t.agent
        .post('/signin')
        .send(`email=${email}`)
        .expect(200)
        .end((e) => e ? reject(e) : resolve())
      }).catch(t.end)
    }

    // Rollback the transaction before ending the test.
    const end = t.end
    t.end = function () {
      const args = arguments
      const next = () => end.apply(t, args)
      transaction.rollback().then(next).catch(next)
      db.query = query
    }

    callback(t)
  })
}
