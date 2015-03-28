exports.up = function (migration, DataTypes, done) {
  migration.addColumn('growers', 'imaged_at', {
    type: DataTypes.DATE
  }).complete(done)
}
