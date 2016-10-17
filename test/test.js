'use strict'

const co = require('co')
const db = require('../db')
const app = require('../app')
const http = require('http')
const tape = require('tape')
const request = require('supertest')
const Client = require('test-client')
const {Builder, By} = require('selenium-webdriver')
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
    t.present = (selector) => driver.isElementPresent(By.css(selector))

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

    // Request without the app requirement.
    t.request = () => request(app)

    // Convenient agent reference.
    t.agent = request.agent(http.createServer(app.callback()))
    t.client = new Client(app)

    // Sign in, with error handling.
    t.signIn = (email) => Promise.all([
      new Promise((resolve, reject) => {
        t.agent
        .post('/session')
        .send({email, password: 'password'})
        .expect(200)
        .end((error) => error ? reject(error) : resolve())
      }),
      t.client.post('/session').send({email, password: 'password'})
    ]).catch(t.end)

    // Rollback the transaction before ending the test.
    const end = t.end.bind(t)
    t.end = (...args) => {
      Promise.all([
        transaction.rollback(),
        visited ? driver.manage().deleteAllCookies() : Promise.resolve()
      ])
      .then(() => end(...args))
      .catch(() => end(...args))
    }

    yield test(t)
  }))
}

exports.driver = driver
