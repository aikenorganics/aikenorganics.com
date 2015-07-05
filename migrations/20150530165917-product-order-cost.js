exports.up = function (migration, DataTypes, done) {
  migration.addColumn('product_orders', 'cost', {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  }).complete(done)
}