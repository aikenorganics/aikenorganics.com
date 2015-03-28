exports.up = function (migration, DataTypes, done) {
  migration.addColumn('growers', 'email', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }).complete(done)
}
