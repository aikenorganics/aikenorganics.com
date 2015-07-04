exports.up = function (migration, DataTypes, done) {
  migration.changeColumn('orders', 'location_id', {
    type: DataTypes.INTEGER,
    allowNull: false
  }).complete(done)
}
