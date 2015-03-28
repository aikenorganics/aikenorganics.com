exports.up = function (migration, DataTypes, done) {
  migration.addColumn('users', 'last', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }).complete(done)
}
