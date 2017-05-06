'use strict'

const db = require('../db')
const app = require('../app')
const tape = require('tape')
const browser = require('./browser')
const Client = require('test-client')

// Export a function with the tape API.
exports = module.exports = (name, test) => tape(name, async (assert) => {
  // Set up transactions.
  const transaction = db.transaction()
  db.query = transaction.query.bind(transaction)

  assert.client = new Client(app)

  // Sign in, with error handling.
  assert.signIn = (email) => (
    assert.client.post('/session').send({email, password: 'secret'})
  )

  try {
    await browser.clear()
    await test(assert)
    assert.end()
  } catch (error) {
    assert.end(error)
  } finally {
    transaction.rollback()
  }
})
