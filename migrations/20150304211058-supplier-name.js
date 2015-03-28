exports.up = function (migration, DataTypes, done) {
  migration.addColumn('suppliers', 'name', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }).complete(done)
}
