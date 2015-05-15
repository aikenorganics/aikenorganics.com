exports.up = function (migration, DataTypes, done) {
  migration.addColumn('orders', 'notes', {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  }).complete(done)
}
