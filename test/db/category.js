'use strict'

const Category = require('../../db/category')
const test = require('../test')

test('position must be a number', async (assert) => {
  const category = new Category()

  for (const value of [1, 1.5, -2, 1.23, 0]) {
    category.position = value
    category.validate()
    assert.ok(!category.errors.position)
  }

  for (const value of ['', '1', 'asdf', NaN, Infinity, undefined, null]) {
    category.position = value
    category.validate()
    assert.deepEqual(category.errors.position, ['Position must be a number.'])
  }
})
