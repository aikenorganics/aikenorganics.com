'use strict'

const co = require('co')
const app = require('../app')
const server = app.listen(4444)
const {Builder, By, until} = require('selenium-webdriver')
const driver = new Builder().forBrowser('chrome').build()

class Driver {

  constructor () {
    this.visited = false
  }

  clear () {
    if (!this.visited) return Promise.resolve()
    this.visited = false
    return driver.manage().deleteAllCookies()
  }

  visit (path) {
    this.visited = true
    return driver.get(`http://localhost:4444${path}`)
  }

  close () {
    server.close()
    driver.quit()
  }

  $ (selector) {
    return driver.findElement(By.css(selector))
  }

  present (selector) {
    return until.elementLocated(By.css(selector))
  }

  wait (predicate) {
    return driver.wait(predicate)
  }

  getPath () {
    return driver.executeScript('return window.location.pathname')
  }

  signIn (email) {
    return co(function *() {
      yield this.visit('/signin')
      yield this.$('#email').sendKeys('admin@example.com')
      yield this.$('#password').sendKeys('password')
      yield this.$('#password').submit()
      yield this.wait(this.present('#signout'))
    }.bind(this))
  }
}

module.exports = new Driver()
