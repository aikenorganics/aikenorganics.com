exports.up = function (migration, DataTypes, done) {
  migration.renameTable('suppliers', 'growers').complete(done)
}
