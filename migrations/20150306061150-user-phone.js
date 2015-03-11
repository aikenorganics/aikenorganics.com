module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('users', 'phone', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }).complete(done)
  }
}
