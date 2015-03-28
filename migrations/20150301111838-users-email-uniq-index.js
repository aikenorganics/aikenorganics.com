exports.up = function (migration, DataTypes, done) {
  migration.addIndex('users', ['email'], {
    indexName: 'users_email_uniq_index',
    indicesType: 'UNIQUE'
  }).complete(done)
}
