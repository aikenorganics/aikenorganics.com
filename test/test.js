'use strict'

const db = require('../db')
const tape = require('tape')
const request = require('supertest')
const app = require('../app')
const signIn = require('./signin')
const query = db.query

// Export a function with the tape API.
exports = module.exports = function (name, callback) {
  tape(name, function (t) {
    // Set up transactions.
    const transaction = db.transaction()
    db.query = transaction.query.bind(transaction)

    // Set a fake hostname
    app.set('hostname', 'open.localhost')
    t.hostname = function (hostname) {
      app.set('hostname', hostname)
    }

    // Request without the app requirement.
    t.request = function () {
      return request(app)
    }

    // Sign in, with error handling.
    t.signIn = function (email) {
      return signIn(request.agent(app), email).catch(t.end)
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
