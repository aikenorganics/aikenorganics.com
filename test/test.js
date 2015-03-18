var tape = require('tape')
var app = require('../app')
var models = require('../models')

// Export a function with the tape API.
module.exports = function (name, options, callback) {
  // Is the first argument the callback?
  if (typeof name === 'function') {
    callback = name
    name = ''
    options = {}
  }

  // Is the second argument the callback?
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  tape(name, options, function(t) {
    // Start a manual transaction.
    models.sequelize.transaction().then(function (transaction) {
      end = t.end
      app.set('transaction', transaction)

      // Rollback the transaction before ending the test.
      t.end = function () {
        transaction.rollback()
        end.apply(t, arguments)
      }

      callback(t)
    })
  })
}
