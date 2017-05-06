'use strict'

const app = require('../app')
const server = app.listen()
const {Builder, By, until} = require('selenium-webdriver')
const driver = new Builder().forBrowser('chrome').build()

class Driver {
  constructor () {
    this.visited = false
  }

  async clear () {
    if (this.visited) {
      this.visited = false
      await driver.manage().deleteAllCookies()
    }
  }

  async visit (path) {
    this.visited = true
    await driver.get(`http://localhost:${server.address().port}${path}`)
    await driver.executeScript('window.scrollTo(0, 0)')
  }

  close () {
    server.close()
    driver.quit()
  }

  $ (selector) {
    return driver.findElement(By.css(selector))
  }

  async exists (selector) {
    return (await driver.findElements(By.css(selector))).length > 0
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

  alert () {
    return driver.switchTo().alert()
  }

  async signIn (email) {
    await this.visit('/session/signin')
    await this.$('#email').sendKeys(email)
    await this.$('#password').sendKeys('password')
    await this.$('#password').submit()
    await this.wait(this.present('#signout'))
  }
}

module.exports = new Driver()
