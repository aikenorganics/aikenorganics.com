'use strict'

const db = require('../db')
const app = require('../app')
const tape = require('tape')
const Browser = require('./browser')
const Client = require('test-client')

const browser = new Browser(app)

// Export a function with the tape API.
exports = module.exports = (name, test) => tape(name, async (assert) => {
  // Set up transactions.
  const transaction = db.transaction()
  db.query = transaction.query.bind(transaction)

  // Test Client
  const client = new Client(app)

  // Sign in, with error handling.
  assert.signIn = (email) => (
    client.post('/session').send({email, password: 'secret'})
  )

  try {
    await browser.clear()
    await test({assert, browser, client})
    assert.end()
  } catch (error) {
    assert.end(error)
  } finally {
    transaction.rollback()
  }
})
