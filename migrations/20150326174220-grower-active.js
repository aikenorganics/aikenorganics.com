module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('growers', 'active', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }).complete(done)
  }
}
