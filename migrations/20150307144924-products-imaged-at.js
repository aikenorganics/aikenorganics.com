module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('products', 'imaged_at', {
      type: DataTypes.DATE
    }).complete(done)
  }
}
