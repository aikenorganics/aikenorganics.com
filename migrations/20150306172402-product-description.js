module.exports = {
  up: function (migration, DataTypes, done) {
    migration.addColumn('products', 'description', {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    }).complete(done)
  }
}
