'use strict'

const co = require('co')
const db = require('../db')
const app = require('../app')
const tape = require('tape')
const Client = require('test-client')
const {Builder, By, until} = require('selenium-webdriver')
const driver = new Builder().forBrowser('chrome').build()

// Export a function with the tape API.
exports = module.exports = (name, test) => {
  tape(name, (t) => co(function *() {
    // Have we visited any pages?
    let visited = false

    // Get a page.
    t.visit = (path) => {
      visited = true
      return driver.get(`http://localhost:4444${path}`)
    }

    // Find an element with a CSS selector.
    t.$ = (selector) => driver.findElement(By.css(selector))

    // Does the element exist?
    t.present = (selector) => until.elementLocated(By.css(selector))

    // Wait for something to happen.
    t.wait = (predicate) => driver.wait(predicate)

    // Get the current path.
    t.getPath = () => driver.executeScript('return window.location.pathname')

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
      yield test(t)
    } finally {
      yield transaction.rollback()
      if (visited) yield driver.manage().deleteAllCookies()
    }

    t.end()
  }).catch(t.end))
}

exports.driver = driver
