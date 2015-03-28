exports.up = function (migration, DataTypes, done) {
  migration.renameColumn('products', 'available', 'supply').complete(done)
}
