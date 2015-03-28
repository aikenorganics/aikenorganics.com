exports.up = function (migration, DataTypes, done) {
  migration.addIndex('products', ['grower_id'], {
    indexName: 'products_grower_id_index'
  }).complete(done)
}
