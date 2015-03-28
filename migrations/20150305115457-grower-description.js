exports.up = function (migration, DataTypes, done) {
  migration.addColumn('growers', 'description', {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  }).complete(done)
}
