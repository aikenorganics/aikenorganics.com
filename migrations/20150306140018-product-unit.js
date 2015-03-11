module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('products', 'unit', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }).complete(done)
  }
}
