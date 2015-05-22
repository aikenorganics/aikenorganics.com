exports.up = function (migration, DataTypes, done) {
  migration.addIndex('markets', ['domain'], {
    indexName: 'markets_domain_unique_index',
    indicesType: 'UNIQUE'
  }).complete(done)
}
