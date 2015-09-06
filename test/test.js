var tape = require('tape')
var request = require('supertest')
var app = require('../app')
var models = require('../models')
var signIn = require('./signin')
var db = require('../db')

var getTransaction = db.transaction.bind(db)

// Export a function with the tape API.
exports = module.exports = function (name, callback) {
  tape(name, function (t) {
    var tx = t.tx = getTransaction()
    db.transaction = function (body) {
      return tx.run(body).then(function () {
        return Promise.all(tx.promises)
      })
    }

    // Start a manual transaction.
    models.sequelize.transaction().then(function (transaction) {
      // Expose the transaction to the test and the app.
      t.transaction = transaction
      app.set('transaction', transaction)

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
      var end = t.end
      t.end = function () {
        var args = arguments
        transaction.rollback()
        tx.rollback().then(function () {
          end.apply(t, args)
        })
      }

      callback(t)
    })
  })
}
