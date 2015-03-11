module.exports = {
  up: function (migration, DataTypes, done) {
    migration.removeIndex('users', 'users_email_uniq_index').complete(done)
  }
}
