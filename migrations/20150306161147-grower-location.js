module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('growers', 'location', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }).complete(done)
  }
}
