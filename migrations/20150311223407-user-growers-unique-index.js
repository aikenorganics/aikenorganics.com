module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addIndex('user_growers', ['user_id', 'grower_id'], {
      indexName: 'user_growers_unique_index',
      indicesType: 'UNIQUE'
    }).complete(done)
  }
}
