exports.up = function (migration, DataTypes, done) {
  migration.addColumn('products', 'category_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: 'categories',
    referencesKey: 'id'
  }).complete(done)
}
