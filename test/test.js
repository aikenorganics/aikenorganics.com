'use strict'

const db = require('../db')
const app = require('../app')
const tape = require('tape')
const driver = require('./driver')
const Client = require('test-client')

// Export a function with the tape API.
exports = module.exports = (name, test) => tape(name, async (t) => {
  // Set up transactions.
  const transaction = db.transaction()
  db.query = transaction.query.bind(transaction)

  t.client = new Client(app)

  // Sign in, with error handling.
  t.signIn = (email) => (
    t.client.post('/session').send({email, password: 'password'})
  )

  try {
    await driver.clear()
    await test(t)
    t.end()
  } catch (error) {
    t.end(error)
  } finally {
    transaction.rollback()
  }
})
