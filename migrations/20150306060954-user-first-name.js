module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('users', 'first', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }).complete(done)
  }
}
