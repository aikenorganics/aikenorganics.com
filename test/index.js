'use strict'

const db = require('../db')
const test = require('./test')

require('./db')
require('./lib')
require('./routes')
require('./integration')

test('teardown', async ({browser}) => {
  browser.quit()
  db.close()
})
