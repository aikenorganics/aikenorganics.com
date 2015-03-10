var test = require('tape');
var models = require('../../models');

test('Product#available subtracts reserved from supply', function(t) {
  var product = models.Product.build({
    supply: 100,
    reserved: 15
  });
  t.equal(product.available(), 85);
  product.reserved = 112;
  t.equal(product.available(), 0);
  t.end();
});

test('Product#isOversold', function(t) {
  var product = models.Product.build({
    supply: 100,
    reserved: 15
  });
  t.ok(!product.isOversold());
  product.supply = 10;
  t.ok(product.isOversold());
  t.end();
});

