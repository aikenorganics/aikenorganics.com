'use strict'

const co = require('co')
const db = require('../db')
const app = require('../app')
const tape = require('tape')
const driver = require('./driver')
const Client = require('test-client')

// Export a function with the tape API.
exports = module.exports = (name, test) => {
  tape(name, (t) => co(function *() {
    // Set up transactions.
    const transaction = db.transaction()
    db.query = transaction.query.bind(transaction)

    // Set a fake hostname
    app.hostname = 'localhost'
    t.hostname = (hostname) => { app.hostname = hostname }

    t.client = new Client(app)

    // Sign in, with error handling.
    t.signIn = (email) => (
      t.client.post('/session').send({email, password: 'password'})
    )

    try {
      yield driver.clear()
      yield test(t)
    } finally {
      yield transaction.rollback()
    }

    t.end()
  }).catch(t.end))
}
