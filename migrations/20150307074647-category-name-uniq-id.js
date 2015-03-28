exports.up = function (migration, DataTypes, done) {
  migration.addIndex('categories', ['name'], {
    indexName: 'categories_name_uniq_index',
    indicesType: 'UNIQUE'
  }).complete(done)
}
