exports.up = function (migration, DataTypes, done) {
  migration.addColumn('orders', 'location_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: 'locations',
    referencesKey: 'id'
  }).complete(done)
}
