module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addIndex('growers', ['active'], {
      indexName: 'growers_active_index'
    }).complete(done)
  }
}
