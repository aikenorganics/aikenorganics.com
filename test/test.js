'use strict'

let db = require('../db')
let tape = require('tape')
let request = require('supertest')
let app = require('../app')
let signIn = require('./signin')

let getTransaction = db.transaction.bind(db)

// Export a function with the tape API.
exports = module.exports = function (name, callback) {
  tape(name, function (t) {
    // Set up transactions.
    let transaction = getTransaction()
    db.transaction = function (body) {
      return transaction.run(body).then(function () {
        return Promise.all(transaction.promises)
      })
    }

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
    let end = t.end
    t.end = function () {
      let args = arguments
      transaction.rollback().then(function () {
        end.apply(t, args)
      })
    }

    callback(t)
  })
}
