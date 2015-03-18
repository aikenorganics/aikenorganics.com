var test = require('../test')
var models = require('../../models')

test('Product#available subtracts reserved from supply', function (t) {
  var product = models.Product.build({
    supply: 100,
    reserved: 15
  })
  t.equal(product.available(), 85)
  product.reserved = 112
  t.equal(product.available(), 0)
  t.end()
})

test('Product#isOversold', function (t) {
  var product = models.Product.build({
    supply: 100,
    reserved: 15
  })
  t.ok(!product.isOversold())
  product.supply = 10
  t.ok(product.isOversold())
  t.end()
})

test('Product#reservedCost', function (t) {
  var product = models.Product.build({
    supply: 100,
    reserved: 8,
    cost: '1.25'
  })
  t.equal(product.reservedCost(), 10)
  t.end()
})

test('validate cost', function (t) {
  models.Product.build({cost: 'asdf'})
  .validate({
    fields: ['cost']
  }).then(function (e) {
    if (e) return t.end()
    t.end('Should be invalid')
  })
})

test('validate cost', function (t) {
  models.Product.build({cost: '.53'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.Product.build({cost: '.53'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.Product.build({cost: '32'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.Product.build({cost: '32.25'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate cost', function (t) {
  models.Product.build({cost: '$32.25'}).validate({
    fields: ['cost']
  }).then(t.end)
})

test('validate name', function (t) {
  models.Product.build({name: ''})
  .validate({
    fields: ['name']
  }).then(function (e) {
    if (e) return t.end()
    t.end('Should be invalid')
  })
})

test('validate supply', function (t) {
  models.Product.build({supply: -2})
  .validate({
    fields: ['supply']
  }).then(function (e) {
    if (e) return t.end()
    t.end('Should be invalid')
  })
})
