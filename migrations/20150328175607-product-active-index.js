exports.up = function (migration, DataTypes, done) {
  migration.addIndex('products', ['active'], {
    indexName: 'products_active_index'
  }).complete(done)
}
