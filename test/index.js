'use strict'

const db = require('../db')
const test = require('./test')
const browser = require('./browser')

require('./db')
require('./lib')
require('./routes')
require('./integration')

test('teardown', async (assert) => {
  await browser.close()
  db.close()
})
