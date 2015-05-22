exports.up = function (migration, DataTypes, done) {
  migration.addColumn('markets', 'domain', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }).complete(done)
}
