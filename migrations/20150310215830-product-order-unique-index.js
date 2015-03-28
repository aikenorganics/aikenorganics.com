exports.up = function (migration, DataTypes, done) {
  migration.addIndex('product_orders', ['order_id', 'product_id'], {
    indexName: 'product_orders_unique_index',
    indicesType: 'UNIQUE'
  }).complete(done)
}
